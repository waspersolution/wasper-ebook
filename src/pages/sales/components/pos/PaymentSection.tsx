
import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, CircleCheck, Smartphone } from 'lucide-react';
import { Payment, Customer } from '../Types';

interface PaymentSectionProps {
  cart: any[];
  payments: Payment[];
  remainingAmount: () => number;
  onPayment: () => void;
  onCheckout: () => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  cart,
  payments,
  remainingAmount,
  onPayment,
  onCheckout
}) => {
  if (cart.length === 0) return null;

  return (
    <Button 
      variant="default"
      onClick={payments.length === 0 ? onPayment : onCheckout}
      disabled={cart.length === 0}
    >
      {payments.length === 0 ? (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Payment
        </>
      ) : remainingAmount() > 0 ? (
        <>
          <Smartphone className="mr-2 h-4 w-4" />
          Add Payment
        </>
      ) : (
        <>
          <CircleCheck className="mr-2 h-4 w-4" />
          Complete Sale
        </>
      )}
    </Button>
  );
};

export default PaymentSection;
