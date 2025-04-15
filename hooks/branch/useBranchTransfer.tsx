import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Item } from '@/types/inventory';

interface UseBranchTransferOptions {
  sourceBranchId: string;
  onTransferComplete?: () => void;
}

// Define the same InventoryProduct interface as in ProductSelect
interface InventoryProduct extends Item {
  stock_quantity?: number;
}

export const useBranchTransfer = ({ 
  sourceBranchId, 
  onTransferComplete 
}: UseBranchTransferOptions) => {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!sourceBranchId) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('items')
          .select('id, name, code, stock_quantity')
          .eq('branch_id', sourceBranchId)
          .order('name');
        
        if (error) throw error;
        
        // Map the data to match our InventoryProduct interface
        const inventoryProducts: InventoryProduct[] = (data || []).map(item => ({
          id: item.id,
          name: item.name,
          code: item.code,
          stock_quantity: item.stock_quantity,
          // Default values for required Item properties
          price: 0,
          description: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));
        
        setProducts(inventoryProducts);
      } catch (error: any) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "Failed to fetch products. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [sourceBranchId, toast]);

  const handleTransfer = async (targetBranchId: string) => {
    if (!targetBranchId || !selectedProduct || quantity <= 0) {
      toast({
        title: "Validation Error",
        description: "Please select a product, target branch, and enter a valid quantity.",
        variant: "destructive"
      });
      return;
    }

    const product = products.find(p => p.id === selectedProduct);
    if (!product) {
      toast({
        title: "Error",
        description: "Selected product not found.",
        variant: "destructive"
      });
      return;
    }

    if ((product.stock_quantity || 0) < quantity) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${product.stock_quantity} units available for transfer.`,
        variant: "destructive"
      });
      return;
    }

    setTransferLoading(true);
    try {
      // Check if product exists in target branch
      const { data: existingProduct, error: fetchError } = await supabase
        .from('items')
        .select('id, stock_quantity')
        .eq('code', product.code)
        .eq('branch_id', targetBranchId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw fetchError;
      }

      // 1. Reduce stock in source branch
      const { error: updateError } = await supabase
        .from('items')
        .update({ stock_quantity: (product.stock_quantity || 0) - quantity })
        .eq('id', selectedProduct);

      if (updateError) throw updateError;

      // 2. Increase stock in target branch or create product if it doesn't exist
      if (existingProduct) {
        // Update existing product in target branch
        const { error: targetUpdateError } = await supabase
          .from('items')
          .update({ stock_quantity: existingProduct.stock_quantity + quantity })
          .eq('id', existingProduct.id);

        if (targetUpdateError) throw targetUpdateError;
      } else {
        // Create new product in target branch with same details but new ID
        const { data: sourceProductDetails, error: sourceDetailError } = await supabase
          .from('items')
          .select('*')
          .eq('id', selectedProduct)
          .single();

        if (sourceDetailError) throw sourceDetailError;

        // Create new product entry for target branch
        const { error: insertError } = await supabase
          .from('items')
          .insert({
            ...sourceProductDetails,
            id: undefined, // Let Supabase generate a new ID
            branch_id: targetBranchId,
            stock_quantity: quantity
          });

        if (insertError) throw insertError;
      }

      toast({
        title: "Transfer Successful",
        description: `Transferred ${quantity} units of ${product.name} successfully.`,
      });

      // Reset form
      setSelectedProduct('');
      setQuantity(1);
      
      // Call callback if provided
      if (onTransferComplete) {
        onTransferComplete();
      }
    } catch (error: any) {
      console.error("Error transferring stock:", error);
      toast({
        title: "Transfer Failed",
        description: error.message || "Failed to transfer stock between branches.",
        variant: "destructive"
      });
    } finally {
      setTransferLoading(false);
    }
  };

  return {
    products,
    loading,
    transferLoading,
    selectedProduct,
    setSelectedProduct,
    quantity,
    setQuantity,
    handleTransfer
  };
};

export default useBranchTransfer;
