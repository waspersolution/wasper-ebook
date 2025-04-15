
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Role, RolePermissions, RoleType } from '@/types/roles';
import { UseRolesState } from './roleTypes';
import { Json } from '@/types/json';

export function useRolesFetch(): UseRolesState & { fetchRoles: () => Promise<void> } {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      // First, check if there are any existing roles
      const { data, error } = await supabase
        .from('role_permissions')
        .select('*')
        .order('is_default', { ascending: false });

      if (error) throw error;
      
      // Log roles to help with debugging
      console.log('Fetched roles from database:', data);
      
      // Cast the JSON permissions data to the expected RolePermissions type
      const typedRoles = data?.map(role => ({
        ...role,
        permissions: role.permissions as unknown as RolePermissions
      })) || [];
      
      setRoles(typedRoles);
      
      // If no roles exist, create default system roles
      if (typedRoles.length === 0) {
        console.log('No roles found, creating default system roles');
        await createDefaultRoles();
      }
    } catch (error: any) {
      console.error('Error fetching roles:', error);
      toast({
        title: 'Error fetching roles',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);
  
  // Function to create default system roles if none exist
  const createDefaultRoles = async () => {
    try {
      // Define default roles with basic permissions
      const defaultRoles = [
        {
          role_name: 'Admin',
          role_type: 'manager' as RoleType,
          is_default: true,
          permissions: {
            users: { read: true, write: true, delete: true, export: true },
            inventory: { read: true, write: true, delete: true, export: true },
            sales: { read: true, write: true, delete: true, export: true },
            accounting: { read: true, write: true, delete: true, export: true }
          } as unknown as Json
        },
        {
          role_name: 'Inventory Manager',
          role_type: 'inventory_manager' as RoleType,
          is_default: true,
          permissions: {
            users: { read: true, write: false, delete: false, export: false },
            inventory: { read: true, write: true, delete: true, export: true },
            sales: { read: true, write: false, delete: false, export: true },
            accounting: { read: false, write: false, delete: false, export: false }
          } as unknown as Json
        },
        {
          role_name: 'Sales Manager',
          role_type: 'sales_manager' as RoleType,
          is_default: true,
          permissions: {
            users: { read: true, write: false, delete: false, export: false },
            inventory: { read: true, write: false, delete: false, export: true },
            sales: { read: true, write: true, delete: true, export: true },
            accounting: { read: false, write: false, delete: false, export: false }
          } as unknown as Json
        }
      ];
      
      // Insert default roles into the database
      const { data, error } = await supabase
        .from('role_permissions')
        .insert(defaultRoles)
        .select();
        
      if (error) throw error;
      
      console.log('Created default roles:', data);
      
      // Update the roles state with the newly created default roles
      if (data) {
        const typedRoles = data.map(role => ({
          ...role,
          permissions: role.permissions as unknown as RolePermissions
        }));
        
        setRoles(typedRoles);
      }
    } catch (error: any) {
      console.error('Error creating default roles:', error);
      toast({
        title: 'Error creating default roles',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return { roles, loading, fetchRoles };
}
