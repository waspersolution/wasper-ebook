
import React from 'react';
import { Branch } from '@/services/types';

interface BranchInfoProps {
  branch: Branch | null;
  label: string;
}

const BranchInfo: React.FC<BranchInfoProps> = ({ branch, label }) => {
  return (
    <div className="p-2 border rounded-md bg-muted/50">
      <div className="font-medium text-sm">{label}</div>
      <div className="text-xs truncate max-w-[120px]">{branch?.name || 'N/A'}</div>
    </div>
  );
};

export default BranchInfo;
