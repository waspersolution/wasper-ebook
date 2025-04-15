
import { useState, useMemo } from 'react';
import { ItemGroup } from '@/types/inventory';

export const useItemGroupFiltering = (itemGroups: ItemGroup[]) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGroups = useMemo(() => {
    return itemGroups.filter(group => 
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [itemGroups, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredGroups
  };
};
