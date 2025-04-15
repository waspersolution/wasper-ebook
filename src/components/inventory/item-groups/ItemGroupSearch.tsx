
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ItemGroupSearchProps {
  searchTerm: string;
  onSearch: (value: string) => void;
}

const ItemGroupSearch: React.FC<ItemGroupSearchProps> = ({ searchTerm, onSearch }) => {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search item groups..."
        className="pl-8"
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default ItemGroupSearch;
