
import React from 'react';
import { Payment } from '../Types';

interface CartSummaryProps {
  calculateSubtotal: () => number;
  calculateTax: () => number;
  calculateTotal: () => number;
  payments: Payment[];
  totalPaid: () => number;
  remainingAmount: () => number;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  payments,
  totalPaid,
  remainingAmount,
}) => {
  return (
    <div className="mt-4 pt-4 border-t">
      <div className="flex justify-between mb-2">
        <span className="font-medium">Subtotal:</span>
        <span>${calculateSubtotal().toFixed(2)}</span>
      </div>
      <div className="flex justify-between mb-4">
        <span className="font-medium">Tax (10%):</span>
        <span>${calculateTax().toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-lg font-bold">
        <span>Total:</span>
        <span>${calculateTotal().toFixed(2)}</span>
      </div>
      
      {payments.length > 0 && (
        <div className="flex justify-between mt-2 text-sm">
          <span>Amount Paid:</span>
          <span className="text-green-600 font-medium">${totalPaid().toFixed(2)}</span>
        </div>
      )}
      
      {payments.length > 0 && remainingAmount() > 0 && (
        <div className="flex justify-between mt-1 text-sm">
          <span>Remaining:</span>
          <span className="text-red-600 font-medium">${remainingAmount().toFixed(2)}</span>
        </div>
      )}
    </div>
  );
};

export default CartSummary;

