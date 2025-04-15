
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CompanyFormValues } from '../types';

interface AdminUserTabProps {
  form: UseFormReturn<CompanyFormValues>;
}

const AdminUserTab: React.FC<AdminUserTabProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="adminEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Admin User Email *</FormLabel>
            <FormControl>
              <Input placeholder="admin@example.com" {...field} />
            </FormControl>
            <FormDescription>
              This user will have full administrator privileges for this company
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AdminUserTab;
