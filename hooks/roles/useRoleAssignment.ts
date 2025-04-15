
import { useCallback } from 'react';
import { supabase, supabaseAdmin } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useRoleAssignment() {
  const { toast } = useToast();

  const assignRoleToUser = useCallback(async (userId: string, roleId: string, companyId: string, branchIds: string[]) => {
    try {
      // Use supabaseAdmin to bypass RLS policies when assigning roles
      const { error: companyError } = await supabaseAdmin
        .from('user_companies')
        .upsert({
          user_id: userId,
          company_id: companyId,
          role_id: roleId
        });
      
      if (companyError) throw companyError;

      // Then, assign access to specific branches
      if (branchIds.length > 0) {
        const branchAssignments = branchIds.map(branchId => ({
          user_id: userId,
          branch_id: branchId,
          role_id: roleId
        }));
        
        const { error: branchError } = await supabaseAdmin
          .from('user_branches')
          .upsert(branchAssignments);
        
        if (branchError) throw branchError;
      }
      
      toast({
        title: 'Role assigned',
        description: 'The role has been assigned to the user successfully.',
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: 'Error assigning role',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  }, [toast]);

  return { assignRoleToUser };
}
