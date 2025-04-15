
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Branch } from '@/services/types';

const formSchema = z.object({
  name: z.string().min(1, 'Branch name is required'),
  address: z.string().min(1, 'Branch address is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  is_main_branch: z.boolean().default(false)
});

type FormValues = z.infer<typeof formSchema>;

interface BranchFormProps {
  onSubmit: (values: FormValues) => Promise<void>;
  branch: Branch | null;
  onCancel: () => void;
}

const BranchForm: React.FC<BranchFormProps> = ({ 
  onSubmit, 
  branch, 
  onCancel 
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: branch?.name || '',
      address: branch?.address || '',
      phone: branch?.phone || '',
      email: branch?.email || '',
      is_main_branch: branch?.is_main_branch || false
    },
  });

  React.useEffect(() => {
    if (branch) {
      form.reset({
        name: branch.name,
        address: branch.address || '',
        phone: branch.phone || '',
        email: branch.email || '',
        is_main_branch: branch.is_main_branch || false
      });
    } else {
      form.reset({
        name: '',
        address: '',
        phone: '',
        email: '',
        is_main_branch: false
      });
    }
  }, [branch, form]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>{branch ? 'Edit Branch' : 'Add New Branch'}</DialogTitle>
        <DialogDescription>
          {branch ? 'Update branch information.' : 'Add a new branch to your company.'}
        </DialogDescription>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Main Branch" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address *</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St, City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="branch@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="is_main_branch"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Main Branch</FormLabel>
                  <FormDescription>
                    Set this as the main branch of the company
                  </FormDescription>
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
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{branch ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};

export default BranchForm;
