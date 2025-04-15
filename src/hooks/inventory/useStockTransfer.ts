
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Product, StockTransfer } from '@/types/inventory';
import { useProducts } from './useProducts';

interface UseStockTransferProps {
  sourceBranchId: string;
  targetBranchId: string | null;
}

export const useStockTransfer = ({ sourceBranchId, targetBranchId }: UseStockTransferProps) => {
  const { products, updateStock } = useProducts();
  const { toast } = useToast();
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [transferHistory, setTransferHistory] = useState<StockTransfer[]>([]);
  const [loading, setLoading] = useState(false);

  const availableProducts = products.filter(product => 
    (product.stock > 0 || (product.stockQuantity && product.stockQuantity > 0))
  );

  const selectedProduct = products.find(p => p.id === selectedProductId);
  
  const handleTransfer = () => {
    if (!selectedProduct || !targetBranchId || quantity <= 0) {
      toast({
        title: "Error",
        description: "Please select a product, target branch and valid quantity",
        variant: "destructive"
      });
      return;
    }

    const currentStock = selectedProduct.stockQuantity || selectedProduct.stock || 0;
    
    if (currentStock < quantity) {
      toast({
        title: "Insufficient stock",
        description: `Only ${currentStock} units available`,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Update source branch inventory (reduce stock)
      updateStock(selectedProductId, currentStock - quantity);
      
      // In a real app, we would create a record in the target branch inventory
      // For now we'll just simulate this with a toast notification
      
      // Record the transfer in history
      const newTransfer: StockTransfer = {
        id: crypto.randomUUID(),
        fromBranchId: sourceBranchId,
        toBranchId: targetBranchId,
        items: [{
          itemId: selectedProductId,
          quantity: quantity
        }],
        status: 'Completed',
        createdAt: new Date().toISOString(),
        createdBy: 'current-user', // Would get from auth context in real app
        notes: `Transfer of ${quantity} units of ${selectedProduct.name}`
      };
      
      setTransferHistory(prev => [newTransfer, ...prev]);
      
      // Reset form
      setSelectedProductId('');
      setQuantity(1);
      
      toast({
        title: "Stock transferred",
        description: `${quantity} units of ${selectedProduct.name} transferred successfully`,
      });
    } catch (error) {
      toast({
        title: "Transfer failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    availableProducts,
    selectedProductId,
    setSelectedProductId,
    quantity,
    setQuantity,
    transferHistory,
    loading,
    handleTransfer
  };
};
