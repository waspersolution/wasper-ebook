
import { Json } from "./json";

export type PermissionAction = "read" | "write" | "delete" | "export";

export interface ModulePermissions {
  read: boolean;
  write: boolean;
  delete: boolean;
  export: boolean;
}

export interface RolePermissions {
  [module: string]: ModulePermissions;
}

export type RoleType = "manager" | "inventory_manager" | "sales_manager" | "custom";

export interface Role {
  id: string;
  role_name: string;
  role_type: RoleType;
  description?: string;
  permissions: RolePermissions;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  company_id?: string;
}

export interface RoleAssignment {
  roleId: string;
  companyId: string;
  branchIds: string[];
}
