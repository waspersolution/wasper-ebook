
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';

import { useSalesData } from './hooks/useSalesData';
import { useCart } from './hooks/useCart';
import { processSale, printReceipt } from './services/checkoutService';
import { Invoice, Payment } from './components/Types';

// Import refactored components
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import PaymentDialog from './components/PaymentDialog';
import ReceiptDialog from './components/ReceiptDialog';
import LoadingState from './components/pos/LoadingState';
import POSHeader from './components/pos/POSHeader';
import PaymentSection from './components/pos/PaymentSection';

const SalesPOS = () => {
  const { toast } = useToast();
  const { 
    products, 
    customers, 
    paymentMethods, 
    loading, 
    branchData, 
    frequentItems
  } = useSalesData();
  
  const { 
    cart, 
    payments, 
    selectedCustomer, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    addPayment, 
    removePayment, 
    clearCart, 
    selectCustomer,
  } = useCart();

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState<Payment['method']>('cash');
  const [currentPaymentAmount, setCurrentPaymentAmount] = useState<number>(0);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);

  const handleAddPayment = () => {
    const success = addPayment(currentPaymentMethod, currentPaymentAmount, calculateRemainingAmount());
    if (success) {
      setCurrentPaymentAmount(calculateRemainingAmount() > 0 ? calculateRemainingAmount() : 0);
    }
  };

  const calculateSubtotal = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const calculateTax = () => calculateSubtotal() * 0.1; // 10% tax
  const calculateTotal = () => calculateSubtotal() + calculateTax();
  const calculateTotalPaid = () => payments.reduce((sum, payment) => sum + payment.amount, 0);
  const calculateRemainingAmount = () => calculateTotal() - calculateTotalPaid();

  // Wrapper function to adapt updateQuantity to match expected signature
  const handleUpdateQuantity = (id: string, quantity: number) => {
    updateQuantity(id, quantity, products);
  };

  // Wrapper function to adapt selectCustomer to match expected signature
  const handleSelectCustomer = (customerId: string) => {
    selectCustomer(customerId, customers);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Please add items to the cart before checkout.',
        variant: 'destructive',
      });
      return;
    }
    
    if (payments.length === 0) {
      setCurrentPaymentAmount(calculateTotal());
      setPaymentDialogOpen(true);
      return;
    }
    
    if (calculateRemainingAmount() > 0) {
      toast({
        title: 'Payment Incomplete',
        description: `Remaining balance: $${calculateRemainingAmount().toFixed(2)}. Please complete payment.`,
        variant: 'destructive',
      });
      setPaymentDialogOpen(true);
      return;
    }

    try {
      const result = await processSale(cart, payments, selectedCustomer, paymentMethods);
      
      if (!result.success || !result.invoice) {
        throw new Error(result.error || 'Failed to process sale');
      }
      
      setCurrentInvoice(result.invoice);
      
      toast({
        title: 'Sale completed',
        description: `Invoice #${result.invoice.invoiceNumber} created successfully.`,
      });
      
      setReceiptDialogOpen(true);
      
    } catch (error: any) {
      console.error("Error processing sale:", error);
      toast({
        title: 'Error',
        description: 'Failed to process sale. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handlePrintReceipt = () => {
    const result = printReceipt(
      currentInvoice,
      cart,
      payments,
      selectedCustomer,
      branchData,
      calculateSubtotal,
      calculateTax,
      calculateTotal
    );
    
    if (!result.success) {
      toast({
        title: 'Print Error',
        description: result.error || 'Could not print receipt.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <POSHeader />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <ProductList 
              products={products} 
              onAddToCart={addToCart}
              frequentItems={frequentItems}
            />
          </div>

          <div>
            <Cart
              cart={cart}
              payments={payments}
              selectedCustomer={selectedCustomer}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveFromCart={removeFromCart}
              onRemovePayment={removePayment}
              onPayment={() => {
                setCurrentPaymentAmount(calculateTotal());
                setPaymentDialogOpen(true);
              }}
              onCheckout={handleCheckout}
              calculateSubtotal={calculateSubtotal}
              calculateTax={calculateTax}
              calculateTotal={calculateTotal}
              totalPaid={calculateTotalPaid}
              remainingAmount={calculateRemainingAmount}
              onClearCart={clearCart}
            />

            <PaymentSection 
              cart={cart}
              payments={payments}
              remainingAmount={calculateRemainingAmount}
              onPayment={() => {
                setCurrentPaymentAmount(calculateTotal());
                setPaymentDialogOpen(true);
              }}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>

      <PaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        currentPaymentMethod={currentPaymentMethod}
        currentPaymentAmount={currentPaymentAmount}
        onPaymentMethodChange={setCurrentPaymentMethod}
        onPaymentAmountChange={setCurrentPaymentAmount}
        onAddPayment={handleAddPayment}
        customers={customers}
        selectedCustomer={selectedCustomer}
        onSelectCustomer={handleSelectCustomer}
        remainingAmount={calculateRemainingAmount()}
      />
      
      <ReceiptDialog
        open={receiptDialogOpen}
        onOpenChange={setReceiptDialogOpen}
        cart={cart}
        payments={payments}
        selectedCustomer={selectedCustomer}
        currentInvoice={currentInvoice}
        branchData={branchData}
        calculateSubtotal={calculateSubtotal}
        calculateTax={calculateTax}
        calculateTotal={calculateTotal}
        onPrintReceipt={handlePrintReceipt}
        onClose={() => {
          setReceiptDialogOpen(false);
          clearCart();
          setCurrentInvoice(null);
        }}
      />
    </Layout>
  );
};

export default SalesPOS;
