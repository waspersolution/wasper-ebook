
import { supabase } from '@/integrations/supabase/client';
import { CartItem, Payment, Customer, SaleData, Invoice, PaymentMethod } from '../components/Types';
import { calculateSubtotal, calculateTax, calculateTotal } from '../utils/salesCalculations';

export async function processSale(
  cart: CartItem[], 
  payments: Payment[], 
  selectedCustomer: Customer | null, 
  paymentMethods: PaymentMethod[]
): Promise<{ success: boolean; invoice: Invoice | null; error?: any }> {
  try {
    if (cart.length === 0) {
      throw new Error('Cart is empty');
    }

    // Generate a random invoice number
    const invoiceNumber = `INV-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    const date = new Date().toISOString();
    
    // Set default payment method (use first payment's method)
    const defaultPaymentMethod = payments[0]?.method || 'cash';
    
    // Create a sale transaction in Supabase
    const saleData: SaleData = {
      invoice_number: invoiceNumber,
      customer_id: selectedCustomer?.id || null,
      subtotal: calculateSubtotal(cart),
      tax_amount: calculateTax(cart),
      total_amount: calculateTotal(cart),
      payment_method: defaultPaymentMethod, // Required field
      items: cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        tax_rate: 10, // Assuming 10% tax
        tax_amount: item.price * item.quantity * 0.1,
        total_amount: item.price * item.quantity * 1.1 // Price + 10% tax
      })),
      payments: payments.map(payment => {
        // Find payment method id based on code
        const paymentMethod = paymentMethods.find(pm => pm.code === payment.method);
        return {
          payment_method_id: paymentMethod?.id || '', // This should be handled better
          amount: payment.amount
        };
      })
    };

    // Insert sale record
    const { data: saleResult, error: saleError } = await supabase
      .from('sales')
      .insert({
        invoice_number: saleData.invoice_number,
        customer_id: saleData.customer_id,
        subtotal: saleData.subtotal,
        tax_amount: saleData.tax_amount,
        total_amount: saleData.total_amount,
        payment_method: saleData.payment_method,
        payment_status: 'paid'
      })
      .select('id')
      .single();

    if (saleError) throw saleError;
    
    // Insert sale items
    const saleId = saleResult.id;
    const saleItemsData = saleData.items.map(item => ({
      sale_id: saleId,
      item_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      tax_rate: item.tax_rate,
      tax_amount: item.tax_amount,
      total_amount: item.total_amount
    }));

    const { error: itemsError } = await supabase
      .from('sale_items')
      .insert(saleItemsData);

    if (itemsError) throw itemsError;
    
    // Create the invoice
    const invoice: Invoice = {
      invoiceNumber,
      date: new Date().toLocaleDateString()
    };
    
    return { success: true, invoice };
  } catch (error) {
    console.error("Error processing sale:", error);
    return { success: false, invoice: null, error };
  }
}

export function printReceipt(
  invoice: Invoice | null, 
  cart: CartItem[], 
  payments: Payment[], 
  selectedCustomer: Customer | null,
  branchData: any,
  calculateSubtotal: () => number,
  calculateTax: () => number,
  calculateTotal: () => number
) {
  const receiptWindow = window.open('', '_blank');
  if (!receiptWindow) {
    return { success: false, error: 'Could not open print window. Please check your pop-up settings.' };
  }
  
  // Build the receipt HTML
  const receiptHTML = `
    <html>
      <head>
        <title>Receipt #${invoice?.invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .receipt { max-width: 400px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 20px; }
          .company { font-size: 20px; font-weight: bold; margin-bottom: 5px; }
          .info { margin-bottom: 20px; }
          .table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          .table th, .table td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
          .summary { margin-top: 20px; }
          .summary div { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .total { font-weight: bold; border-top: 1px solid #000; padding-top: 5px; margin-top: 5px; }
          .footer { margin-top: 30px; text-align: center; font-size: 14px; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="company">${branchData?.branches?.name || 'WASPER Solutions'}</div>
            <div>${branchData?.branches?.address || '123 Main Street'}</div>
            <div>Phone: ${branchData?.branches?.phone || '555-123-4567'}</div>
            <div>Email: ${branchData?.branches?.email || 'info@wasper.com'}</div>
          </div>
          
          <div class="info">
            <div><strong>Receipt #:</strong> ${invoice?.invoiceNumber}</div>
            <div><strong>Date:</strong> ${invoice?.date}</div>
            <div><strong>Customer:</strong> ${selectedCustomer ? selectedCustomer.name : 'Walk-in Customer'}</div>
          </div>
          
          <table class="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${cart.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.price.toFixed(2)}</td>
                  <td>$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="summary">
            <div><span>Subtotal:</span> <span>$${calculateSubtotal().toFixed(2)}</span></div>
            <div><span>Tax (10%):</span> <span>$${calculateTax().toFixed(2)}</span></div>
            <div class="total"><span>Total:</span> <span>$${calculateTotal().toFixed(2)}</span></div>
            
            <div style="margin-top: 15px;"><strong>Payment Methods:</strong></div>
            ${payments.map(payment => {
              const formattedMethod = payment.method
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
              return `
                <div><span>${formattedMethod}:</span> <span>$${payment.amount.toFixed(2)}</span></div>
              `;
            }).join('')}
          </div>
          
          <div class="footer">
            Thank you for your business!
          </div>
          
          <div class="no-print" style="margin-top: 30px; text-align: center;">
            <button onclick="window.print();" style="padding: 10px 20px;">Print Receipt</button>
          </div>
        </div>
      </body>
    </html>
  `;
  
  receiptWindow.document.open();
  receiptWindow.document.write(receiptHTML);
  receiptWindow.document.close();
  
  // Trigger print after the document is fully loaded
  receiptWindow.onload = () => {
    setTimeout(() => {
      receiptWindow.print();
    }, 500);
  };

  return { success: true };
}
