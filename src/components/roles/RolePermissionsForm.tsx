
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the permission groups
const permissionGroups = [
  {
    name: 'Users & Roles',
    permissions: [
      { id: 'user_view', name: 'View Users' },
      { id: 'user_create', name: 'Create Users' },
      { id: 'user_edit', name: 'Edit Users' },
      { id: 'user_delete', name: 'Delete Users' },
      { id: 'role_manage', name: 'Manage Roles' }
    ]
  },
  {
    name: 'Branches',
    permissions: [
      { id: 'branch_view', name: 'View Branches' },
      { id: 'branch_create', name: 'Create Branches' },
      { id: 'branch_edit', name: 'Edit Branches' },
      { id: 'branch_delete', name: 'Delete Branches' }
    ]
  },
  {
    name: 'Inventory',
    permissions: [
      { id: 'inventory_view', name: 'View Inventory' },
      { id: 'inventory_create', name: 'Add Products' },
      { id: 'inventory_edit', name: 'Edit Products' },
      { id: 'inventory_delete', name: 'Delete Products' },
      { id: 'stock_adjust', name: 'Adjust Stock' }
    ]
  },
  {
    name: 'Sales',
    permissions: [
      { id: 'sales_view', name: 'View Sales' },
      { id: 'sales_create', name: 'Create Sales' },
      { id: 'sales_edit', name: 'Edit Sales' },
      { id: 'sales_delete', name: 'Delete Sales' },
      { id: 'pos_access', name: 'Access POS' }
    ]
  },
  {
    name: 'Accounting',
    permissions: [
      { id: 'ledger_view', name: 'View Ledger' },
      { id: 'ledger_create', name: 'Create Entries' },
      { id: 'ledger_edit', name: 'Edit Entries' },
      { id: 'report_access', name: 'View Reports' }
    ]
  }
];

const formSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  description: z.string().optional(),
  // Dynamically add permissions
  ...Object.fromEntries(
    permissionGroups.flatMap(group => 
      group.permissions.map(permission => [permission.id, z.boolean().optional()])
    )
  )
});

type FormValues = z.infer<typeof formSchema>;

interface RolePermissionsFormProps {
  onSubmit: (values: FormValues) => void;
  initialData?: FormValues;
}

export const RolePermissionsForm: React.FC<RolePermissionsFormProps> = ({ 
  onSubmit,
  initialData
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      // Default all permissions to false
      ...Object.fromEntries(
        permissionGroups.flatMap(group => 
          group.permissions.map(permission => [permission.id, false])
        )
      )
    }
  });

  const handleSelectAllInGroup = (group: string, checked: boolean) => {
    const groupPermissions = permissionGroups.find(g => g.name === group)?.permissions || [];
    groupPermissions.forEach(permission => {
      form.setValue(permission.id as any, checked);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Role Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Sales Manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief description of this role" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional description to help identify this role's purpose
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {permissionGroups.map((group) => (
          <Card key={group.name}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{group.name} Permissions</span>
                <div className="space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSelectAllInGroup(group.name, true)}
                  >
                    Select All
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSelectAllInGroup(group.name, false)}
                  >
                    Clear All
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Control what actions users with this role can perform in {group.name.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.permissions.map((permission) => (
                  <FormField
                    key={permission.id}
                    control={form.control}
                    name={permission.id as any}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">{permission.name}</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-end">
          <Button type="submit">Save Role Configuration</Button>
        </div>
      </form>
    </Form>
  );
};

export default RolePermissionsForm;
