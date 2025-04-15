
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Branch } from '@/services/types';

interface BranchTransferSelectorProps {
  branches: Branch[];
  selectedBranchId: string;
  transferTargetId: string | null;
  onSelectTarget: (targetId: string) => void;
}

const BranchTransferSelector: React.FC<BranchTransferSelectorProps> = ({
  branches,
  selectedBranchId,
  transferTargetId,
  onSelectTarget
}) => {
  return (
    <div className="space-y-2">
      <Label>Select Target Branch</Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {branches
          .filter(branch => branch.id !== selectedBranchId)
          .map(branch => (
            <div 
              key={branch.id}
              className={`p-3 border rounded-md cursor-pointer ${
                transferTargetId === branch.id 
                  ? 'border-primary bg-primary/10' 
                  : 'hover:bg-muted'
              }`}
              onClick={() => onSelectTarget(branch.id)}
            >
              <p className="font-medium">{branch.name}</p>
              <p className="text-xs text-muted-foreground truncate">{branch.address}</p>
            </div>
          ))
        }
      </div>
      
      {branches.length <= 1 && (
        <p className="text-amber-600 text-sm">
          You need at least two branches to perform stock transfers.
        </p>
      )}

      {transferTargetId && (
        <div className="border-t pt-6">
          <div className="flex items-center justify-center mb-4 text-sm">
            <div className="font-medium">{branches.find(b => b.id === selectedBranchId)?.name}</div>
            <ArrowRight className="mx-2 text-muted-foreground" />
            <div className="font-medium">
              {branches.find(b => b.id === transferTargetId)?.name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchTransferSelector;
