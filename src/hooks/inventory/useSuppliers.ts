
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Supplier } from '@/types/inventory';

// Mock data - would be replaced with API calls in a real implementation
const mockSuppliers: Supplier[] = [
  { 
    id: '1', 
    name: 'Tech Supplies Inc', 
    contactPerson: 'John Smith',
    email: 'john@techsupplies.com',
    phone: '123-456-7890',
    address: '123 Tech St, San Francisco, CA'
  },
  { 
    id: '2', 
    name: 'Office Depot', 
    contactPerson: 'Jane Doe',
    email: 'jane@officedepot.com',
    phone: '234-567-8901',
    address: '456 Office Ave, New York, NY'
  },
  { 
    id: '3', 
    name: 'Global Electronics', 
    contactPerson: 'Robert Johnson',
    email: 'robert@globalelec.com',
    phone: '345-678-9012',
    address: '789 Global Blvd, Chicago, IL'
  },
  { 
    id: '4', 
    name: 'Furniture Plus', 
    contactPerson: 'Emily Wilson',
    email: 'emily@furnitureplus.com',
    phone: '456-789-0123',
    address: '101 Chair St, Seattle, WA'
  }
];

export const useSuppliers = () => {
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock API call - would be replaced with actual API in real implementation
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
      
      setSuppliers(mockSuppliers);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch suppliers');
      setError(error);
      toast({
        title: 'Error',
        description: 'Failed to load suppliers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addSupplier = (supplier: Supplier) => {
    setSuppliers(prev => [...prev, supplier]);
  };

  const updateSupplier = (updatedSupplier: Supplier) => {
    setSuppliers(prev => 
      prev.map(supplier => supplier.id === updatedSupplier.id ? updatedSupplier : supplier)
    );
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
  };

  return {
    suppliers,
    loading,
    error,
    addSupplier,
    updateSupplier,
    deleteSupplier
  };
};
