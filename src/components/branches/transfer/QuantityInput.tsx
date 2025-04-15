
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface QuantityInputProps {
  quantity: number;
  setQuantity: (value: number) => void;
  disabled?: boolean;
}

const QuantityInput: React.FC<QuantityInputProps> = ({ 
  quantity, 
  setQuantity, 
  disabled = false 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="quantity">Quantity</Label>
      <Input 
        id="quantity"
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        disabled={disabled}
      />
    </div>
  );
};

export default QuantityInput;
