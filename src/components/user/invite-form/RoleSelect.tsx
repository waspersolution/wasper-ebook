
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { Role } from '@/types/roles';
import { InviteFormValues } from './UserInviteSchema';

interface RoleSelectProps {
  form: UseFormReturn<InviteFormValues>;
  roles: Role[];
  loading: boolean;
  companyId: string;
}

export const RoleSelect = ({ form, roles, loading, companyId }: RoleSelectProps) => {
  // Filter roles based on selected company
  const filteredRoles = roles.filter(role => {
    // For custom roles, only show those that match the selected company or have no company_id
    if (role.role_type === 'custom') {
      return !role.company_id || role.company_id === companyId;
    }
    // Always show default system roles
    return true;
  });

  console.log('Available roles:', roles);
  console.log('Filtered roles for company:', companyId, filteredRoles);

  return (
    <FormField
      control={form.control}
      name="role"
      render={({ field }) => (
        <FormItem>
          <FormLabel>User Role *</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            value={field.value}
            disabled={loading || !companyId}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={
                  loading ? "Loading roles..." :
                  !companyId ? "Select a company first" :
                  "Select a role"
                } />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {loading ? (
                <SelectItem value="loading" disabled>Loading roles...</SelectItem>
              ) : !companyId ? (
                <SelectItem value="none" disabled>Select a company first</SelectItem>
              ) : filteredRoles && filteredRoles.length > 0 ? (
                filteredRoles.map((role: Role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.role_name} {role.is_default && '(Default)'}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>No roles available</SelectItem>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
