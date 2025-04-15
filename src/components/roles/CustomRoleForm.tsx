
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { getAvailableModules, createEmptyPermissions } from '@/utils/permissions-utils';
import { ModulePermissions, RolePermissions } from '@/types/roles';

const customRoleSchema = z.object({
  roleName: z.string().min(3, 'Role name must be at least 3 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  // We'll handle permissions separately
});

type CustomRoleFormValues = z.infer<typeof customRoleSchema>;

interface CustomRoleFormProps {
  initialPermissions?: RolePermissions;
  onSubmit: (values: { roleName: string; description: string; permissions: RolePermissions }) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

const CustomRoleForm: React.FC<CustomRoleFormProps> = ({
  initialPermissions,
  onSubmit,
  onCancel,
  isEdit = false
}) => {
  const modules = getAvailableModules();
  const [permissions, setPermissions] = useState<RolePermissions>(
    initialPermissions || createEmptyPermissions(modules)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CustomRoleFormValues>({
    resolver: zodResolver(customRoleSchema),
    defaultValues: {
      roleName: '',
      description: '',
    },
  });

  const handlePermissionChange = (
    module: string,
    action: keyof ModulePermissions,
    checked: boolean
  ) => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: checked,
      },
    }));
  };

  const handleSelectAllForModule = (module: string, checked: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        read: checked,
        write: checked,
        delete: checked,
        export: checked,
      },
    }));
  };

  const handleFormSubmit = async (values: CustomRoleFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        roleName: values.roleName,
        description: values.description,
        permissions,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="roleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Marketing Manager" {...field} />
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
                  <Input placeholder="Brief description of this role's permissions" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Module Permissions</h3>
          <p className="text-sm text-muted-foreground">
            Configure what actions users with this role can perform in each module
          </p>

          <div className="grid gap-4">
            {modules.map(module => (
              <Card key={module}>
                <CardHeader className="py-4">
                  <CardTitle className="text-base flex justify-between items-center capitalize">
                    <span>{module}</span>
                    <div className="space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleSelectAllForModule(module, true)}
                      >
                        Select All
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleSelectAllForModule(module, false)}
                      >
                        Clear All
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Read Permission */}
                    <div className="flex flex-row items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2">
                          <span role="img" aria-label="read">✅</span> Read
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">Can view {module} data</p>
                      </div>
                      <Switch
                        checked={permissions[module]?.read || false}
                        onCheckedChange={(checked) =>
                          handlePermissionChange(module, 'read', checked)
                        }
                      />
                    </div>

                    {/* Write Permission */}
                    <div className="flex flex-row items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2">
                          <span role="img" aria-label="write">✍️</span> Write
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">Can create and edit {module}</p>
                      </div>
                      <Switch
                        checked={permissions[module]?.write || false}
                        onCheckedChange={(checked) =>
                          handlePermissionChange(module, 'write', checked)
                        }
                      />
                    </div>

                    {/* Delete Permission */}
                    <div className="flex flex-row items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2">
                          <span role="img" aria-label="delete">❌</span> Delete
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">Can delete {module} data</p>
                      </div>
                      <Switch
                        checked={permissions[module]?.delete || false}
                        onCheckedChange={(checked) =>
                          handlePermissionChange(module, 'delete', checked)
                        }
                      />
                    </div>

                    {/* Export Permission */}
                    <div className="flex flex-row items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2">
                          <span role="img" aria-label="export">⬇️</span> Export
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">Can export {module} data</p>
                      </div>
                      <Switch
                        checked={permissions[module]?.export || false}
                        onCheckedChange={(checked) =>
                          handlePermissionChange(module, 'export', checked)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEdit ? 'Update Role' : 'Create Role'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CustomRoleForm;
