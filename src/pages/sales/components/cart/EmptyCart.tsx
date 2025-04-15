
import React from 'react';
import { ShoppingCart } from 'lucide-react';

const EmptyCart = () => {
  return (
    <div className="text-center py-8">
      <ShoppingCart className="h-8 w-8 mx-auto text-muted-foreground" />
      <p className="mt-2 text-sm text-muted-foreground">Add products to begin a sale</p>
    </div>
  );
};

export default EmptyCart;

