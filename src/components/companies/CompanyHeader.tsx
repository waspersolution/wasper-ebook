
import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CompanyHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddClick: () => void;
}

const CompanyHeader: React.FC<CompanyHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onAddClick
}) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Companies</h1>
        <p className="text-muted-foreground">Manage your companies and branches</p>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search companies..."
            className="pl-8 w-full md:w-[250px]"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button onClick={onAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Add Company
        </Button>
      </div>
    </div>
  );
};

export default CompanyHeader;
