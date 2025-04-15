
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const SearchBar = () => {
  return (
    <div className="hidden md:flex items-center gap-2 relative max-w-md">
      <Search size={18} className="absolute left-3 text-muted-foreground" />
      <Input
        placeholder="Search..."
        className="pl-9 w-full max-w-[300px]"
      />
    </div>
  );
};

export default SearchBar;
