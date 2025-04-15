
import React from 'react';
import { ArrowRight } from 'lucide-react';
import BranchInfo from './BranchInfo';
import { Branch } from '@/services/types';

interface TransferVisualizationProps {
  sourceBranch: Branch | null;
  targetBranch: Branch | null;
}

const TransferVisualization: React.FC<TransferVisualizationProps> = ({ 
  sourceBranch, 
  targetBranch 
}) => {
  return (
    <div className="flex items-center justify-center gap-4 py-2">
      <BranchInfo branch={sourceBranch} label="Source" />
      <ArrowRight className="text-muted-foreground" />
      <BranchInfo branch={targetBranch} label="Target" />
    </div>
  );
};

export default TransferVisualization;
