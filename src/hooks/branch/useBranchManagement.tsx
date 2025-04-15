
import { useEffect } from 'react';
import { useBranchState } from './useBranchState';
import { useBranchAPI } from './useBranchAPI';
import { useBranchActions } from './useBranchActions';
import { Branch } from '@/services/types';

export const useBranchManagement = () => {
  const {
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
  } = useBranchState();

  const { fetchBranches } = useBranchAPI({
    setBranches,
    setLoading,
    setSelectedBranch,
    selectedBranch
  });

  const {
    handleSaveBranch,
    handleDelete,
    handleEdit,
    handleAddBranch,
    handleBranchSelect
  } = useBranchActions({
    branches,
    fetchBranches,
    setIsDialogOpen,
    setEditingBranch,
    editingBranch,
    selectedBranch,
    setSelectedBranch
  });

  useEffect(() => {
    fetchBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    branches,
    loading,
    searchTerm,
    setSearchTerm,
    isDialogOpen,
    setIsDialogOpen,
    editingBranch,
    selectedBranch,
    transferTargetId,
    setTransferTargetId,
    handleSaveBranch,
    handleDelete,
    handleEdit,
    handleAddBranch,
    handleBranchSelect,
    fetchBranches,
  };
};

export default useBranchManagement;
