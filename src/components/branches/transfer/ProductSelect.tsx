
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Item } from '@/types/inventory';

// Define a consistent InventoryProduct interface that correctly extends Item
interface InventoryProduct extends Item {
  // Item already has code as required property, so we don't need to redefine it
  stock_quantity?: number;
}

interface ProductSelectProps {
  products: InventoryProduct[];
  selectedProduct: string;
  setSelectedProduct: (value: string) => void;
  loading: boolean;
}

const ProductSelect: React.FC<ProductSelectProps> = ({ 
  products, 
  selectedProduct, 
  setSelectedProduct, 
  loading 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="product">Select Product</Label>
      <Select 
        value={selectedProduct} 
        onValueChange={setSelectedProduct}
        disabled={loading || products.length === 0}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a product" />
        </SelectTrigger>
        <SelectContent>
          {products.map((product) => (
            <SelectItem key={product.id} value={product.id}>
              {product.name} ({product.code}) - Available: {product.stock_quantity}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductSelect;
