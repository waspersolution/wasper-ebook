
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Branch } from '@/services/types';
import { useAuth } from '@/hooks/useAuth';

interface FormValues {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  is_main_branch: boolean;
}

interface BranchActionsOptions {
  branches: Branch[];
  fetchBranches: () => Promise<void>;
  setIsDialogOpen: (isOpen: boolean) => void;
  setEditingBranch: (branch: Branch | null) => void;
  editingBranch: Branch | null;
  selectedBranch: Branch | null;
  setSelectedBranch: (branch: Branch | null) => void;
}

export const useBranchActions = ({
  branches,
  fetchBranches,
  setIsDialogOpen,
  setEditingBranch,
  editingBranch,
  selectedBranch,
  setSelectedBranch
}: BranchActionsOptions) => {
  const { companyBranch } = useAuth();
  const companyId = companyBranch.companyId;
  const { toast } = useToast();

  const handleSaveBranch = async (values: FormValues) => {
    if (!companyId) {
      toast({
        title: "Error",
        description: "Company ID is required",
        variant: "destructive"
      });
      return;
    }

    try {
      // If this is being set as main branch, unset any existing main branch
      if (values.is_main_branch) {
        await supabase
          .from('branches')
          .update({ is_main_branch: false })
          .eq('company_id', companyId);
      }

      if (editingBranch) {
        // Update existing branch
        console.log("Updating branch:", editingBranch.id, values);
        const { error } = await supabase
          .from('branches')
          .update({
            name: values.name,
            address: values.address,
            phone: values.phone || null,
            email: values.email || null,
            is_main_branch: values.is_main_branch
          })
          .eq('id', editingBranch.id);

        if (error) throw error;

        toast({
          title: 'Branch updated',
          description: `Branch "${values.name}" has been updated.`,
        });
      } else {
        // Create new branch
        console.log("Creating new branch for company:", companyId, values);
        const { data, error } = await supabase
          .from('branches')
          .insert({
            company_id: companyId,
            name: values.name,
            address: values.address,
            phone: values.phone || null,
            email: values.email || null,
            is_main_branch: values.is_main_branch
          })
          .select()
          .single();

        if (error) throw error;

        // Map database response to our Branch interface
        const newBranch: Branch = {
          id: data.id,
          companyId: data.company_id,
          name: data.name,
          address: data.address,
          phone: data.phone,
          email: data.email,
          is_main_branch: data.is_main_branch,
          status: "active"
        };

        toast({
          title: 'Branch created',
          description: `Branch "${values.name}" has been created.`,
        });

        // If this is the first branch, select it
        if (branches.length === 0) {
          setSelectedBranch(newBranch);
        }
      }
      
      // Refresh branches list
      fetchBranches();
      setIsDialogOpen(false);
      setEditingBranch(null);
    } catch (error: any) {
      console.error("Error saving branch:", error);
      toast({
        title: 'Error',
        description: error.message || "Failed to save branch",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Check if there are any items in this branch
      const { count, error: countError } = await supabase
        .from('items')
        .select('id', { count: 'exact', head: true })
        .eq('branch_id', id);
        
      if (countError) throw countError;
      
      if (count && count > 0) {
        toast({
          title: "Cannot Delete Branch",
          description: `This branch has ${count} items associated with it. Transfer or delete these items first.`,
          variant: "destructive"
        });
        return;
      }
      
      const { error } = await supabase
        .from('branches')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Branch deleted',
        description: 'The branch has been deleted successfully.',
      });
      
      // If the deleted branch was selected, clear selection
      if (selectedBranch && selectedBranch.id === id) {
        setSelectedBranch(null);
      }
      
      // Refresh branches list
      fetchBranches();
    } catch (error: any) {
      console.error("Error deleting branch:", error);
      toast({
        title: 'Error',
        description: error.message || "Failed to delete branch",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setIsDialogOpen(true);
  };

  const handleAddBranch = () => {
    setEditingBranch(null);
    setIsDialogOpen(true);
  };
  
  const handleBranchSelect = (branch: Branch) => {
    setSelectedBranch(branch);
  };

  return {
    handleSaveBranch,
    handleDelete,
    handleEdit,
    handleAddBranch,
    handleBranchSelect,
  };
};
