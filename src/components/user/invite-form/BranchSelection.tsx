
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { Branch, InviteFormValues } from './UserInviteSchema';

interface BranchSelectionProps {
  form: UseFormReturn<InviteFormValues>;
  branches: Branch[];
  companyId: string;
}

export const BranchSelection = ({ form, branches, companyId }: BranchSelectionProps) => {
  const filteredBranches = companyId 
    ? branches.filter(branch => branch.company_id === companyId)
    : [];

  const handleBranchChange = (branchId: string, checked: boolean) => {
    form.setValue('branchIds', 
      checked 
        ? [...form.getValues('branchIds'), branchId] 
        : form.getValues('branchIds').filter(id => id !== branchId)
    );
  };

  return (
    <FormField
      control={form.control}
      name="branchIds"
      render={() => (
        <FormItem>
          <div className="mb-4">
            <FormLabel className="text-base">Branch Assignment *</FormLabel>
            <div className="text-sm text-muted-foreground">
              Select branches this user will have access to.
            </div>
          </div>
          <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
            {companyId ? (
              filteredBranches.length > 0 ? (
                filteredBranches.map(branch => (
                  <div key={branch.id} className="flex items-center space-x-2 py-1">
                    <Checkbox
                      id={`branch-${branch.id}`}
                      onCheckedChange={(checked) => 
                        handleBranchChange(branch.id, checked === true)
                      }
                    />
                    <label
                      htmlFor={`branch-${branch.id}`}
                      className="text-sm"
                    >
                      {branch.name}
                    </label>
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
  );
};
