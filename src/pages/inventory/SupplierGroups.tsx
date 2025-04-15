
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Edit, Trash2, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { SupplierGroup } from '@/types/inventory';

const formSchema = z.object({
  name: z.string().min(1, 'Group name is required'),
  description: z.string().optional(),
  parentId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const SupplierGroups = () => {
  const { toast } = useToast();
  const [supplierGroups, setSupplierGroups] = useState<SupplierGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<SupplierGroup | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      parentId: '',
    },
  });

  // Reset form when dialog opens or changes between add/edit
  useEffect(() => {
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
  }, [editingGroup, form, isDialogOpen]);

  // Fetch supplier groups - in a real app, this would come from the database
  useEffect(() => {
    // Simulate API call with mock data
    setLoading(true);
    setTimeout(() => {
      const mockData: SupplierGroup[] = [
        { 
          id: '1', 
          name: 'Wholesalers', 
          description: 'Wholesale suppliers and distributors',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        { 
          id: '2', 
          name: 'Manufacturers', 
          description: 'Direct manufacturers',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        { 
          id: '3', 
          name: 'Local Vendors', 
          description: 'Local small-scale suppliers',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        { 
          id: '4', 
          name: 'International', 
          description: 'International suppliers',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        { 
          id: '5', 
          name: 'Electronics', 
          parentId: '2',
          description: 'Electronics manufacturers',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
      ];
      setSupplierGroups(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const filteredGroups = supplierGroups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const onSubmit = async (values: FormValues) => {
    // In a real app, this would save to the database
    if (editingGroup) {
      // Update existing group
      const updatedGroups = supplierGroups.map(group => 
        group.id === editingGroup.id 
          ? { 
              ...group, 
              name: values.name, 
              description: values.description,
              parentId: values.parentId,
              updatedAt: new Date().toISOString() 
            } 
          : group
      );
      setSupplierGroups(updatedGroups);
      toast({
        title: 'Supplier group updated',
        description: `Group "${values.name}" has been updated.`,
      });
    } else {
      // Add new group
      const newGroup: SupplierGroup = {
        id: Math.random().toString(36).substring(7),
        name: values.name,
        description: values.description,
        parentId: values.parentId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setSupplierGroups([...supplierGroups, newGroup]);
      toast({
        title: 'Supplier group created',
        description: `Group "${values.name}" has been created.`,
      });
    }
    
    setIsDialogOpen(false);
    setEditingGroup(null);
  };

  const handleEdit = (group: SupplierGroup) => {
    setEditingGroup(group);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSupplierGroups(supplierGroups.filter(group => group.id !== id));
    toast({
      title: 'Supplier group deleted',
      description: 'The supplier group has been deleted successfully.',
    });
  };

  const handleAddGroup = () => {
    setEditingGroup(null);
    setIsDialogOpen(true);
  };

  const getParentGroupName = (parentId?: string) => {
    if (!parentId) return null;
    const parent = supplierGroups.find(group => group.id === parentId);
    return parent ? parent.name : null;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Supplier Groups</h1>
            <p className="text-muted-foreground">
              Manage categories for your suppliers and vendors
            </p>
          </div>
          
          <Button onClick={handleAddGroup} size="sm">
            <Plus className="mr-2 h-4 w-4" /> Add Group
          </Button>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search supplier groups..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Supplier Groups</CardTitle>
            <CardDescription>
              {filteredGroups.length} supplier {filteredGroups.length === 1 ? 'group' : 'groups'} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-4">
                <p>Loading supplier groups...</p>
              </div>
            ) : filteredGroups.length > 0 ? (
              <div className="space-y-2">
                {filteredGroups.map((group) => (
                  <div 
                    key={group.id} 
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{group.name}</p>
                      {group.description && (
                        <p className="text-sm text-muted-foreground">{group.description}</p>
                      )}
                      {getParentGroupName(group.parentId) && (
                        <div className="text-xs text-muted-foreground flex items-center mt-1">
                          <span>Parent: {getParentGroupName(group.parentId)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(group)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500"
                        onClick={() => handleDelete(group.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8">
                <p>No supplier groups found matching your search.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={handleAddGroup}
                >
                  <Plus className="mr-2 h-4 w-4" /> Create your first supplier group
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Supplier Group Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingGroup ? 'Edit Supplier Group' : 'Add New Supplier Group'}</DialogTitle>
            <DialogDescription>
              {editingGroup ? 'Update supplier group details.' : 'Create a new supplier group for categorizing vendors.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Wholesalers" {...field} />
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
                      <Input placeholder="Wholesale suppliers and distributors" {...field} />
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
                        {supplierGroups
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
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingGroup ? 'Update' : 'Create'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default SupplierGroups;
