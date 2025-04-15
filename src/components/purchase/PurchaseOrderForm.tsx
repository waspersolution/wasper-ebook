
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
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useSuppliers } from '@/hooks/inventory/useSuppliers';
import PurchaseOrderItems from './PurchaseOrderItems';
import { PurchaseOrderItem } from '@/types/purchase';

interface PurchaseOrderFormProps {
  onClose: () => void;
}

const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({ onClose }) => {
  const { toast } = useToast();
  const { suppliers, loading: loadingSuppliers } = useSuppliers();
  
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [poNumber, setPoNumber] = useState<string>(`PO-${new Date().getTime().toString().slice(-6)}`);
  const [poDate, setPoDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<PurchaseOrderItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleAddItem = (item: PurchaseOrderItem) => {
    const existingItemIndex = items.findIndex(i => i.itemId === item.itemId);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += item.quantity;
      setItems(updatedItems);
    } else {
      setItems([...items, item]);
    }
  };

  const handleUpdateItem = (index: number, item: Partial<PurchaseOrderItem>) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], ...item };
    setItems(updatedItems);
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const handleSubmit = async () => {
    if (!selectedSupplier) {
      toast({
        title: "Error",
        description: "Please select a supplier",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one item",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      // Would be replaced with actual API call in a real implementation
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Success",
        description: "Purchase order created successfully",
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating purchase order:', error);
      toast({
        title: "Error",
        description: "Failed to create purchase order",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
  };

  return (
    <div className="space-y-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="poNumber">PO Number</Label>
          <Input 
            id="poNumber" 
            value={poNumber} 
            onChange={(e) => setPoNumber(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="poDate">Date</Label>
          <Input 
            id="poDate" 
            type="date" 
            value={poDate} 
            onChange={(e) => setPoDate(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="supplier">Supplier</Label>
          <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
            <SelectTrigger>
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent>
              {loadingSuppliers ? (
                <SelectItem value="loading" disabled>Loading suppliers...</SelectItem>
              ) : (
                suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <PurchaseOrderItems 
            items={items} 
            onAddItem={handleAddItem} 
            onUpdateItem={handleUpdateItem}
            onRemoveItem={handleRemoveItem}
          />
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">Total Items: {items.length}</p>
          <p className="text-lg font-bold">Total: ${calculateTotal().toFixed(2)}</p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Creating..." : "Create Purchase Order"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderForm;
