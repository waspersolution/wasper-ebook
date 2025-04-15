
import { useState } from 'react';
import { Branch } from '@/services/types';

export const useBranchState = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [transferTargetId, setTransferTargetId] = useState<string | null>(null);

  return {
    branches,
    setBranches,
    loading,
    setLoading,
    searchTerm,
    setSearchTerm,
    isDialogOpen,
    setIsDialogOpen,
    editingBranch,
    setEditingBranch,
    selectedBranch,
    setSelectedBranch,
    transferTargetId,
    setTransferTargetId
  };
};
