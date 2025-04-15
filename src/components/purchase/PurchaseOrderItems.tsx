
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';
import { useProducts } from '@/hooks/inventory/useProducts';
import { PurchaseOrderItem } from '@/types/purchase';

interface PurchaseOrderItemsProps {
  items: PurchaseOrderItem[];
  onAddItem: (item: PurchaseOrderItem) => void;
  onUpdateItem: (index: number, item: Partial<PurchaseOrderItem>) => void;
  onRemoveItem: (index: number) => void;
}

const PurchaseOrderItems: React.FC<PurchaseOrderItemsProps> = ({
  items,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
}) => {
  const { products, loading: loadingProducts } = useProducts();
  
  const [newItemId, setNewItemId] = useState<string>('');
  const [newQuantity, setNewQuantity] = useState<number>(1);
  const [newUnitPrice, setNewUnitPrice] = useState<number>(0);

  const handleAddItem = () => {
    if (!newItemId) return;
    
    const selectedProduct = products.find(p => p.id === newItemId);
    if (!selectedProduct) return;
    
    const newItem: PurchaseOrderItem = {
      itemId: newItemId,
      name: selectedProduct.name,
      quantity: newQuantity,
      unitPrice: newUnitPrice || selectedProduct.price,
      totalPrice: newQuantity * (newUnitPrice || selectedProduct.price)
    };
    
    onAddItem(newItem);
    
    // Reset form
    setNewItemId('');
    setNewQuantity(1);
    setNewUnitPrice(0);
  };

  const handleQuantityChange = (index: number, value: number) => {
    const item = items[index];
    const newTotal = value * item.unitPrice;
    
    onUpdateItem(index, { 
      quantity: value,
      totalPrice: newTotal
    });
  };

  const handleUnitPriceChange = (index: number, value: number) => {
    const item = items[index];
    const newTotal = item.quantity * value;
    
    onUpdateItem(index, {
      unitPrice: value,
      totalPrice: newTotal
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Order Items</h3>
      
      {/* Add new item form */}
      <div className="grid grid-cols-12 gap-2 items-end">
        <div className="col-span-5">
          <Label htmlFor="itemSelect">Item</Label>
          <Select value={newItemId} onValueChange={setNewItemId}>
            <SelectTrigger id="itemSelect">
              <SelectValue placeholder="Select item" />
            </SelectTrigger>
            <SelectContent>
              {loadingProducts ? (
                <SelectItem value="loading" disabled>Loading items...</SelectItem>
              ) : (
                products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} (${product.price.toFixed(2)})
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input 
            id="quantity" 
            type="number" 
            min="1"
            value={newQuantity}
            onChange={(e) => setNewQuantity(parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="col-span-3">
          <Label htmlFor="unitPrice">Unit Price</Label>
          <Input 
            id="unitPrice" 
            type="number" 
            min="0" 
            step="0.01" 
            value={newUnitPrice || ''}
            onChange={(e) => setNewUnitPrice(parseFloat(e.target.value) || 0)}
            placeholder="Item price"
          />
        </div>
        <div className="col-span-2">
          <Button 
            onClick={handleAddItem}
            disabled={!newItemId || newQuantity <= 0}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
      </div>
      
      {/* List of added items */}
      {items.length > 0 ? (
        <div className="border rounded-md">
          <table className="min-w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-4 py-2">Item</th>
                <th className="text-right px-4 py-2">Quantity</th>
                <th className="text-right px-4 py-2">Unit Price</th>
                <th className="text-right px-4 py-2">Total</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">
                    <Input
                      type="number"
                      min="1"
                      className="w-20 ml-auto"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 0)}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-24 ml-auto"
                      value={item.unitPrice}
                      onChange={(e) => handleUnitPriceChange(index, parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td className="px-4 py-2 text-right font-medium">
                    ${item.totalPrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveItem(index)}
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="border rounded-md p-6 text-center text-muted-foreground">
          No items added yet. Use the form above to add items to this purchase order.
        </div>
      )}
    </div>
  );
};

export default PurchaseOrderItems;
