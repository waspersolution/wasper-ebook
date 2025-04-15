
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from '@/components/ui/form';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useRoles } from '@/hooks/useRoles';
import { supabase } from '@/integrations/supabase/client';
import { Role } from '@/types/roles';
import { Check, X } from 'lucide-react';

interface Branch {
  id: string;
  name: string;
  company_id: string;
}

interface Company {
  id: string;
  name: string;
}

const roleAssignmentSchema = z.object({
  roleId: z.string().min(1, 'Please select a role'),
  companyId: z.string().min(1, 'Please select a company'),
  branchIds: z.array(z.string()).min(1, 'Please select at least one branch'),
});

type RoleAssignmentFormValues = z.infer<typeof roleAssignmentSchema>;

interface UserRoleAssignmentProps {
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const UserRoleAssignment = ({ userId, onSuccess, onCancel }: UserRoleAssignmentProps) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { roles, loading: rolesLoading, assignRoleToUser } = useRoles();

  const form = useForm<RoleAssignmentFormValues>({
    resolver: zodResolver(roleAssignmentSchema),
    defaultValues: {
      roleId: '',
      companyId: '',
      branchIds: [],
    },
  });

  const watchCompanyId = form.watch('companyId');

  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('id, name')
        .order('name');

      if (!error && data) {
        setCompanies(data);
      }
    };

    fetchCompanies();
  }, []);

  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      const { data, error } = await supabase
        .from('branches')
        .select('id, name, company_id')
        .order('name');

      if (!error && data) {
        setBranches(data);
      }
    };

    fetchBranches();
  }, []);

  // Filter branches based on selected company
  useEffect(() => {
    if (watchCompanyId) {
      const filtered = branches.filter(branch => branch.company_id === watchCompanyId);
      setFilteredBranches(filtered);
      
      // Reset branch selection when company changes
      form.setValue('branchIds', []);
    } else {
      setFilteredBranches([]);
    }
  }, [watchCompanyId, branches, form]);

  const handleSubmit = async (values: RoleAssignmentFormValues) => {
    setIsSubmitting(true);
    try {
      const success = await assignRoleToUser(
        userId,
        values.roleId,
        values.companyId,
        values.branchIds
      );
      
      if (success) {
        onSuccess();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRoles = roles.filter(role => {
    // For custom roles, only show those that match the selected company or have no company_id
    if (role.role_type === 'custom') {
      return !role.company_id || role.company_id === watchCompanyId;
    }
    // Always show default system roles
    return true;
  });

  const handleBranchChange = (branchId: string, checked: boolean) => {
    const currentBranches = form.getValues('branchIds');
    
    if (checked) {
      form.setValue('branchIds', [...currentBranches, branchId]);
    } else {
      form.setValue('branchIds', currentBranches.filter(id => id !== branchId));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="roleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Role</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {rolesLoading ? (
                    <SelectItem value="loading" disabled>Loading roles...</SelectItem>
                  ) : filteredRoles.length > 0 ? (
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

        <FormField
          control={form.control}
          name="companyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {companies.length > 0 ? (
                    companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>No companies available</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="branchIds"
          render={() => (
            <FormItem>
              <FormLabel>Branches</FormLabel>
              <div className="space-y-2 border rounded-md p-4 max-h-60 overflow-y-auto">
                {watchCompanyId ? (
                  filteredBranches.length > 0 ? (
                    filteredBranches.map(branch => (
                      <div key={branch.id} className="flex items-center space-x-2">
                        <Controller
                          control={form.control}
                          name="branchIds"
                          render={({ field }) => (
                            <Checkbox
                              checked={field.value?.includes(branch.id)}
                              onCheckedChange={(checked) => 
                                handleBranchChange(branch.id, checked === true)
                              }
                            />
                          )}
                        />
                        <label className="text-sm">{branch.name}</label>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No branches found for this company</p>
                  )
                ) : (
                  <p className="text-sm text-muted-foreground">Select a company first to view branches</p>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {form.getValues('roleId') && (
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-2">Permission Overview:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredRoles.find(r => r.id === form.getValues('roleId'))?.permissions && 
                Object.entries(filteredRoles.find(r => r.id === form.getValues('roleId'))?.permissions || {}).map(([module, perms]) => (
                  <div key={module} className="rounded border p-2">
                    <h4 className="font-medium capitalize mb-1">{module}</h4>
                    <div className="text-sm grid grid-cols-2 gap-x-2 gap-y-1">
                      <div className="flex items-center gap-1">
                        {perms.read ? 
                          <Check className="h-4 w-4 text-green-500" /> : 
                          <X className="h-4 w-4 text-red-500" />} Read
                      </div>
                      <div className="flex items-center gap-1">
                        {perms.write ? 
                          <Check className="h-4 w-4 text-green-500" /> : 
                          <X className="h-4 w-4 text-red-500" />} Write
                      </div>
                      <div className="flex items-center gap-1">
                        {perms.delete ? 
                          <Check className="h-4 w-4 text-green-500" /> : 
                          <X className="h-4 w-4 text-red-500" />} Delete
                      </div>
                      <div className="flex items-center gap-1">
                        {perms.export ? 
                          <Check className="h-4 w-4 text-green-500" /> : 
                          <X className="h-4 w-4 text-red-500" />} Export
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )}
        
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Assigning...' : 'Assign Role'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserRoleAssignment;
