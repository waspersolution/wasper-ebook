import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ItemGroup } from '@/types/inventory';

export const useItemGroups = () => {
  const { toast } = useToast();
  const [itemGroups, setItemGroups] = useState<ItemGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchItemGroups();
  }, []);

  const fetchItemGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mock data - replace with actual API call later
      const mockData = [
        { 
          id: '1', 
          name: 'Electronics', 
          description: 'Electronic devices and accessories',
          parent_id: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: '2', 
          name: 'Clothing', 
          description: 'Apparel and fashion items',
          parent_id: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: '3', 
          name: 'Home', 
          description: 'Home goods and furniture',
          parent_id: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: '4', 
          name: 'Smartphones', 
          description: 'Mobile phones and accessories',
          parent_id: '1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: '5', 
          name: 'Laptops', 
          description: 'Portable computers',
          parent_id: '1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
      ];
      
      const formattedData: ItemGroup[] = mockData.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        parentId: item.parent_id || undefined,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
      
      setItemGroups(formattedData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch item groups');
      setError(error);
      toast({
        title: 'Error',
        description: 'Failed to load item groups',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addItemGroup = (newGroup: ItemGroup) => {
    setItemGroups(prev => [...prev, newGroup]);
  };

  const updateItemGroup = (updatedGroup: ItemGroup) => {
    setItemGroups(prev => 
      prev.map(group => group.id === updatedGroup.id ? updatedGroup : group)
    );
  };

  const deleteItemGroup = (id: string) => {
    setItemGroups(prev => prev.filter(group => group.id !== id));
  };

  return {
    itemGroups,
    loading,
    error,
    addItemGroup,
    updateItemGroup,
    deleteItemGroup
  };
};
