
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Receipt } from 'lucide-react';
import { CartItem, Payment, Customer, Invoice, BranchData } from './Types';

interface ReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  payments: Payment[];
  selectedCustomer: Customer | null;
  currentInvoice: Invoice | null;
  branchData: BranchData | null;
  calculateSubtotal: () => number;
  calculateTax: () => number;
  calculateTotal: () => number;
  onPrintReceipt: () => void;
  onClose: () => void;
}

const ReceiptDialog: React.FC<ReceiptDialogProps> = ({
  open,
  onOpenChange,
  cart,
  payments,
  selectedCustomer,
  currentInvoice,
  branchData,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  onPrintReceipt,
  onClose,
}) => {
  const formatPaymentMethod = (method: string) => {
    return method
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" /> Receipt
          </DialogTitle>
          <DialogDescription>
            Transaction completed successfully
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[70vh]">
          <div className="p-4 border rounded-md bg-background">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold">{branchData?.branches?.name || 'WASPER Solutions'}</h3>
              <p className="text-sm text-muted-foreground">{branchData?.branches?.address || '123 Main Street'}</p>
              <p className="text-sm text-muted-foreground">
                {branchData?.branches?.phone || '555-123-4567'} | {branchData?.branches?.email || 'info@wasper.com'}
              </p>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Receipt #:</span>
                <span>{currentInvoice?.invoiceNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Date:</span>
                <span>{currentInvoice?.date}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Customer:</span>
                <span>{selectedCustomer ? selectedCustomer.name : 'Walk-in Customer'}</span>
              </div>
            </div>
            
            <div className="border-t border-b py-2 mb-4">
              <div className="grid grid-cols-12 gap-1 text-sm font-medium mb-2">
                <div className="col-span-6">Item</div>
                <div className="col-span-2 text-right">Qty</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              
              {cart.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-1 text-sm py-1">
                  <div className="col-span-6">{item.name}</div>
                  <div className="col-span-2 text-right">{item.quantity}</div>
                  <div className="col-span-2 text-right">${item.price.toFixed(2)}</div>
                  <div className="col-span-2 text-right">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Subtotal:</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span>Tax (10%):</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-1 border-t">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="text-sm font-medium mb-2">Payment Methods:</div>
              {payments.map((payment, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{formatPaymentMethod(payment.method)}:</span>
                  <span>${payment.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>Thank you for your business!</p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              onClose();
            }}
          >
            Close
          </Button>
          <Button
            onClick={onPrintReceipt}
          >
            <Receipt className="mr-2 h-4 w-4" />
            Print Receipt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptDialog;
