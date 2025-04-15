
import { Role, RolePermissions } from '@/types/roles';

export interface UseRolesState {
  roles: Role[];
  loading: boolean;
}

export interface UseRolesActions {
  fetchRoles: () => Promise<void>;
  createRole: (role: Partial<Role>) => Promise<Role | null>;
  updateRole: (id: string, updates: Partial<Role>) => Promise<Role | null>;
  deleteRole: (id: string) => Promise<boolean>;
  assignRoleToUser: (userId: string, roleId: string, companyId: string, branchIds: string[]) => Promise<boolean>;
}

export type UseRolesReturn = UseRolesState & UseRolesActions;
