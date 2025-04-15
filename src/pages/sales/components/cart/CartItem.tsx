
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { CartItem as CartItemType } from '../Types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveFromCart: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemoveFromCart,
}) => {
  return (
    <div className="flex items-center justify-between p-2 border rounded-md">
      <div className="flex-1">
        <p className="font-medium">{item.name}</p>
        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          -
        </Button>
        <span className="w-8 text-center">{item.quantity}</span>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          disabled={item.quantity >= item.stock}
        >
          +
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-red-500"
          onClick={() => onRemoveFromCart(item.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;

