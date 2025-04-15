
import React from 'react';
import { Search, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Branch } from '@/services/types';

interface BranchListProps {
  branches: Branch[];
  selectedBranch: Branch | null;
  onEdit: (branch: Branch) => void;
  onDelete: (branchId: string) => void;
  onSelect: (branch: Branch) => void; // Added this property to match usage
  onBranchSelect?: (branch: Branch) => void; // This might be used elsewhere
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const BranchList: React.FC<BranchListProps> = ({
  branches,
  selectedBranch,
  onEdit,
  onDelete,
  onSelect,
  onBranchSelect, // This handles backward compatibility
  searchTerm,
  onSearchChange
}) => {
  // Determine which function to use for selection
  const handleBranchSelect = (branch: Branch) => {
    if (onSelect) {
      onSelect(branch);
    } else if (onBranchSelect) {
      onBranchSelect(branch);
    }
  };

  const filteredBranches = branches.filter(branch => 
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (branch.address && branch.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search branches..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-lg">Branches</CardTitle>
          <CardDescription>
            {filteredBranches.length} {filteredBranches.length === 1 ? 'branch' : 'branches'} found
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <div className="max-h-[500px] overflow-y-auto">
            {filteredBranches.map((branch) => (
              <div 
                key={branch.id} 
                className={`flex items-center justify-between p-3 mb-1 rounded-md cursor-pointer ${
                  selectedBranch?.id === branch.id ? 'bg-primary/10' : 'hover:bg-muted'
                }`}
                onClick={() => handleBranchSelect(branch)}
              >
                <div>
                  <p className="font-medium">{branch.name}</p>
                  <p className="text-xs text-muted-foreground">{branch.address}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={(e) => {
                    e.stopPropagation();
                    onEdit(branch);
                  }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(branch.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {filteredBranches.length === 0 && (
              <div className="text-center p-4">
                <p>No branches found matching your search.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BranchList;
