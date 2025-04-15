
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, CreditCard, CircleCheck, Smartphone } from 'lucide-react';
import { CartItem as CartItemType, Payment, Customer } from './Types';

import EmptyCart from './cart/EmptyCart';
import CartItem from './cart/CartItem';
import CartCustomerInfo from './cart/CartCustomerInfo';
import CartPayments from './cart/CartPayments';
import CartSummary from './cart/CartSummary';

interface CartProps {
  cart: CartItemType[];
  payments: Payment[];
  selectedCustomer: Customer | null;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveFromCart: (id: string) => void;
  onRemovePayment: (index: number) => void;
  onPayment: () => void;
  onCheckout: () => void;
  calculateSubtotal: () => number;
  calculateTax: () => number;
  calculateTotal: () => number;
  totalPaid: () => number;
  remainingAmount: () => number;
  onClearCart: () => void;
}

const Cart: React.FC<CartProps> = ({
  cart,
  payments,
  selectedCustomer,
  onUpdateQuantity,
  onRemoveFromCart,
  onRemovePayment,
  onPayment,
  onCheckout,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  totalPaid,
  remainingAmount,
  onClearCart,
}) => {
  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Current Sale
        </CardTitle>
        <CardDescription>
          {cart.length === 0 
            ? "No items in cart" 
            : `${cart.length} ${cart.length === 1 ? 'item' : 'items'} in cart`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col h-[calc(100vh-300px)]">
        <div className="flex-grow overflow-auto space-y-3">
          {cart.length === 0 ? (
            <EmptyCart />
          ) : (
            cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemoveFromCart={onRemoveFromCart}
              />
            ))
          )}
        </div>
        
        {selectedCustomer && <CartCustomerInfo customer={selectedCustomer} />}
        
        <CartPayments 
          payments={payments}
          onRemovePayment={onRemovePayment}
        />
        
        <CartSummary
          calculateSubtotal={calculateSubtotal}
          calculateTax={calculateTax}
          calculateTotal={calculateTotal}
          payments={payments}
          totalPaid={totalPaid}
          remainingAmount={remainingAmount}
        />
        
        <div className="grid grid-cols-2 gap-2 mt-4">
          <Button variant="outline" onClick={onClearCart}>
            Clear
          </Button>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default Cart;

