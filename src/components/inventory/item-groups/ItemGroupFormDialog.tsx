import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ItemGroup } from '@/types/inventory';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  name: z.string().min(1, 'Group name is required'),
  description: z.string().optional(),
  parentId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ItemGroupFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: FormValues) => void;
  itemGroups: ItemGroup[];
  editingGroup: ItemGroup | null;
}

const ItemGroupFormDialog: React.FC<ItemGroupFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  itemGroups,
  editingGroup,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: editingGroup?.name || '',
      description: editingGroup?.description || '',
      parentId: editingGroup?.parentId || '',
    },
  });

  React.useEffect(() => {
    if (editingGroup) {
      form.reset({
        name: editingGroup.name,
        description: editingGroup.description || '',
        parentId: editingGroup.parentId || '',
      });
    } else {
      form.reset({
        name: '',
        description: '',
        parentId: '',
      });
    }
  }, [editingGroup, form]);

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingGroup ? 'Edit Item Group' : 'Add New Item Group'}</DialogTitle>
          <DialogDescription>
            {editingGroup ? 'Update item group details.' : 'Create a new group for categorizing inventory items.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
            {isSubmitting ? (
              <div className="space-y-4">
                <Skeleton className="h-[72px] w-full" />
                <Skeleton className="h-[72px] w-full" />
                <Skeleton className="h-[72px] w-full" />
              </div>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Electronics" {...field} />
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
                        <Input placeholder="Electronic devices and accessories" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Group (optional)</FormLabel>
                      <FormControl>
                        <select 
                          className="w-full px-3 py-2 border rounded-md"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                        >
                          <option value="">None (Top Level)</option>
                          {itemGroups
                            .filter(g => !editingGroup || g.id !== editingGroup.id)
                            .map(group => (
                              <option key={group.id} value={group.id}>
                                {group.name}
                              </option>
                            ))
                          }
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : editingGroup ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ItemGroupFormDialog;
