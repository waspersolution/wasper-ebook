
import React from 'react';
import Layout from '@/components/layout/Layout';
import BranchList from '@/components/branches/BranchList';
import BranchForm from '@/components/branches/BranchForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useBranchManagement } from '@/hooks/branch/useBranchManagement';

const BranchManagement = () => {
  const { companyBranch } = useAuth();
  const {
    branches,
    loading,
    searchTerm,
    setSearchTerm,
    isDialogOpen,
    setIsDialogOpen,
    editingBranch,
    selectedBranch,
    handleSaveBranch,
    handleDelete,
    handleEdit,
    handleAddBranch,
    handleBranchSelect
  } = useBranchManagement();

  return (
    <Layout requireContext={true}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Branch Management</h1>
            <p className="text-muted-foreground">
              Manage branches for {companyBranch.companyName}
            </p>
          </div>
          <Button onClick={handleAddBranch}>
            <Plus className="mr-2 h-4 w-4" />
            Add Branch
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : (
          <BranchList
            branches={branches}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSelect={handleBranchSelect}
            selectedBranch={selectedBranch}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingBranch ? 'Edit Branch' : 'Add New Branch'}</DialogTitle>
          </DialogHeader>
          <BranchForm
            branch={editingBranch}
            onSubmit={handleSaveBranch}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default BranchManagement;
