
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Role, RolePermissions } from '@/types/roles';
import { Json } from '@/types/json';

export function useRolesMutations(setRoles: React.Dispatch<React.SetStateAction<Role[]>>) {
  const { toast } = useToast();

  const createRole = useCallback(async (role: Partial<Role>) => {
    try {
      // Cast the RolePermissions to Json for the database
      const dbRole = {
        role_name: role.role_name,
        role_type: role.role_type || 'custom',
        permissions: role.permissions as unknown as Json,
        is_default: false,
        company_id: role.company_id
      };

      const { data, error } = await supabase
        .from('role_permissions')
        .insert(dbRole)
        .select()
        .single();

      if (error) throw error;
      
      // Cast back from Json to RolePermissions when adding to state
      const newRole: Role = {
        ...data,
        permissions: data.permissions as unknown as RolePermissions
      };
      
      setRoles(prev => [...prev, newRole]);
      toast({
        title: 'Role created',
        description: `Role "${role.role_name}" has been created successfully.`,
      });
      
      return newRole;
    } catch (error: any) {
      toast({
        title: 'Error creating role',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  }, [toast, setRoles]);

  const updateRole = useCallback(async (id: string, updates: Partial<Role>) => {
    try {
      // Cast the RolePermissions to Json for the database update
      const dbUpdates = {
        ...updates,
        permissions: updates.permissions ? updates.permissions as unknown as Json : undefined
      };

      const { data, error } = await supabase
        .from('role_permissions')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Cast back from Json to RolePermissions when updating state
      const updatedRole: Role = {
        ...data,
        permissions: data.permissions as unknown as RolePermissions
      };
      
      setRoles(prev => prev.map(role => role.id === id ? updatedRole : role));
      toast({
        title: 'Role updated',
        description: `Role "${updates.role_name || ''}" has been updated successfully.`,
      });
      
      return updatedRole;
    } catch (error: any) {
      toast({
        title: 'Error updating role',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  }, [toast, setRoles]);

  const deleteRole = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('role_permissions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setRoles(prev => prev.filter(role => role.id !== id));
      toast({
        title: 'Role deleted',
        description: 'The role has been deleted successfully.',
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: 'Error deleting role',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  }, [toast, setRoles]);

  return { createRole, updateRole, deleteRole };
}
