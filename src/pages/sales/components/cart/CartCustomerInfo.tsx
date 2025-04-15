
import React from 'react';
import { Customer } from '../Types';

interface CartCustomerInfoProps {
  customer: Customer;
}

const CartCustomerInfo: React.FC<CartCustomerInfoProps> = ({ customer }) => {
  if (!customer) return null;

  return (
    <div className="my-2 p-2 bg-muted rounded-md">
      <p className="text-sm font-medium">Customer: {customer.name}</p>
      <p className="text-xs text-muted-foreground">Credit Limit: ${customer.credit_limit?.toFixed(2)}</p>
    </div>
  );
};

export default CartCustomerInfo;

