
import { useState, useEffect } from 'react';
import { Role } from '@/types/roles';
import { useRolesFetch } from './roles/useRolesFetch';
import { useRolesMutations } from './roles/useRolesMutations';
import { useRoleAssignment } from './roles/useRoleAssignment';
import { UseRolesReturn } from './roles/roleTypes';

export function useRoles(): UseRolesReturn {
  const [roles, setRoles] = useState<Role[]>([]);
  const { roles: fetchedRoles, loading, fetchRoles } = useRolesFetch();
  const { createRole, updateRole, deleteRole } = useRolesMutations(setRoles);
  const { assignRoleToUser } = useRoleAssignment();

  // Sync roles state with fetched roles
  useEffect(() => {
    setRoles(fetchedRoles);
  }, [fetchedRoles]);

  // Initial fetch
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return {
    roles,
    loading,
    fetchRoles,
    createRole,
    updateRole, 
    deleteRole,
    assignRoleToUser
  };
}
