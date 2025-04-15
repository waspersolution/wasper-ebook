
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Branch } from '@/services/types';
import { useAuth } from '@/hooks/useAuth';

// Simple function to generate UUID-like strings
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

interface BranchAPIOptions {
  setBranches: (branches: Branch[]) => void;
  setLoading: (loading: boolean) => void;
  setSelectedBranch: (branch: Branch | null) => void;
  selectedBranch: Branch | null;
}

export const useBranchAPI = ({
  setBranches,
  setLoading,
  setSelectedBranch,
  selectedBranch
}: BranchAPIOptions) => {
  const { companyBranch } = useAuth();
  const companyId = companyBranch.companyId;
  const { toast } = useToast();

  const fetchBranches = async () => {
    if (!companyId) {
      toast({
        title: "No company selected",
        description: "Please select a company first",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('company_id', companyId)
        .order('name');

      if (error) throw error;
      
      console.log("Fetched branches:", data);
      
      // Map database fields to our Branch interface
      let mappedBranches: Branch[] = [];
      
      if (data && data.length > 0) {
        // If we have branches, use them
        mappedBranches = data.map(item => ({
          id: item.id,
          companyId: item.company_id,
          name: item.name,
          address: item.address,
          phone: item.phone,
          email: item.email,
          is_main_branch: item.is_main_branch,
          status: "active"
        }));
      } else {
        // If no branches found, create a default main branch
        const uuid = generateUUID();
        const mainBranch: Branch = {
          id: uuid,
          companyId,
          name: "Main Branch",
          address: null,
          phone: null,
          email: null,
          is_main_branch: true,
          status: "active"
        };
        
        // Insert the main branch into the database
        const { data: newBranch, error: insertError } = await supabase
          .from('branches')
          .insert({
            id: uuid,
            company_id: companyId,
            name: mainBranch.name,
            is_main_branch: true
          })
          .select()
          .single();
          
        if (insertError) {
          console.error("Error creating main branch:", insertError);
          toast({
            title: "Error",
            description: "Failed to create main branch",
            variant: "destructive"
          });
        } else {
          console.log("Created main branch:", newBranch);
          mappedBranches = [{
            id: newBranch.id,
            companyId: newBranch.company_id,
            name: newBranch.name,
            address: newBranch.address,
            phone: newBranch.phone,
            email: newBranch.email,
            is_main_branch: newBranch.is_main_branch,
            status: "active"
          }];
        }
      }
      
      setBranches(mappedBranches);
      
      // Select the first branch by default if none is selected
      if (mappedBranches.length > 0 && !selectedBranch) {
        setSelectedBranch(mappedBranches[0]);
      }
    } catch (error: any) {
      console.error("Error fetching branches:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load branches",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return { fetchBranches };
};
