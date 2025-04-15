
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Payment } from '../Types';

interface CartPaymentsProps {
  payments: Payment[];
  onRemovePayment: (index: number) => void;
}

const CartPayments: React.FC<CartPaymentsProps> = ({ payments, onRemovePayment }) => {
  const formatPaymentMethod = (method: string) => {
    return method
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (payments.length === 0) return null;

  return (
    <div className="mt-2 space-y-2">
      <p className="text-sm font-medium">Payment Methods:</p>
      {payments.map((payment, index) => (
        <div key={index} className="flex justify-between items-center p-2 bg-muted rounded-md">
          <span className="text-sm capitalize">{formatPaymentMethod(payment.method)}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">${payment.amount.toFixed(2)}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 text-red-500"
              onClick={() => onRemovePayment(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartPayments;

