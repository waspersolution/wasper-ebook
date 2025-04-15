
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Mock data - would be replaced with API calls in a real implementation
const mockPurchaseOrders = [
  { id: 'PO-001', supplier: 'Tech Supplies Inc', date: '2025-04-10', total: 2599.98, status: 'Processing' },
  { id: 'PO-002', supplier: 'Office Depot', date: '2025-04-09', total: 450.75, status: 'Received' },
  { id: 'PO-003', supplier: 'Global Electronics', date: '2025-04-08', total: 3275.50, status: 'Cancelled' },
  { id: 'PO-004', supplier: 'Furniture Plus', date: '2025-04-07', total: 1200.25, status: 'Processing' },
  { id: 'PO-005', supplier: 'Paper Co', date: '2025-04-06', total: 325.75, status: 'Received' },
];

export const usePurchaseOrders = () => {
  const { toast } = useToast();
  const [purchaseOrders, setPurchaseOrders] = useState(mockPurchaseOrders);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const fetchPurchaseOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock API call - would be replaced with actual API in real implementation
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      // Filter orders based on search term
      const filteredOrders = mockPurchaseOrders.filter(order => 
        order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) || 
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setPurchaseOrders(filteredOrders);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch purchase orders');
      setError(error);
      toast({
        title: 'Error',
        description: 'Failed to load purchase orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch whenever search term changes
  useEffect(() => {
    fetchPurchaseOrders();
  }, [searchTerm]);

  const createPurchaseOrder = async (orderData: any) => {
    // Would implement actual API call to create a purchase order
    // For now, just add to the mock data
    const newOrder = {
      id: `PO-${new Date().getTime().toString().slice(-6)}`,
      supplier: orderData.supplierName,
      date: new Date().toISOString().split('T')[0],
      total: orderData.items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0),
      status: 'Processing',
    };
    
    setPurchaseOrders([newOrder, ...purchaseOrders]);
    
    return newOrder;
  };

  return {
    purchaseOrders,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    createPurchaseOrder,
    fetchPurchaseOrders
  };
};
