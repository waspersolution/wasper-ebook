
import { ModulePermissions, PermissionAction, RolePermissions } from "@/types/roles";

// Default empty permissions for a module
export const emptyModulePermissions = (): ModulePermissions => ({
  read: false,
  write: false,
  delete: false,
  export: false,
});

// Create empty permissions for all modules
export const createEmptyPermissions = (moduleNames: string[]): RolePermissions => {
  return moduleNames.reduce<RolePermissions>((acc, module) => {
    acc[module] = emptyModulePermissions();
    return acc;
  }, {});
};

// Check if a user has permission for a specific action on a module
export const hasPermission = (
  permissions: RolePermissions | undefined,
  module: string,
  action: PermissionAction
): boolean => {
  if (!permissions || !permissions[module]) {
    return false;
  }
  return !!permissions[module][action];
};

// Get a list of available system modules that can have permissions set
export const getAvailableModules = (): string[] => {
  return [
    "dashboard",
    "users",
    "roles",
    "companies",
    "branches",
    "inventory",
    "sales",
    "purchases",
    "accounting",
    "reports",
    "settings"
  ];
};
