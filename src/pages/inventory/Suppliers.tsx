import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Search, Edit, Trash2, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Supplier, SupplierGroup } from '@/types/inventory';

const formSchema = z.object({
  name: z.string().min(1, 'Supplier name is required'),
  code: z.string().min(1, 'Code is required'),
  contactPerson: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  taxId: z.string().optional(),
  supplierGroupId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const Suppliers = () => {
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierGroups, setSupplierGroups] = useState<SupplierGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      code: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      taxId: '',
      supplierGroupId: '',
    },
  });

  useEffect(() => {
    if (editingSupplier) {
      form.reset({
        name: editingSupplier.name,
        code: editingSupplier.code,
        contactPerson: editingSupplier.contactPerson || '',
        email: editingSupplier.email || '',
        phone: editingSupplier.phone || '',
        address: editingSupplier.address || '',
        taxId: editingSupplier.taxId || '',
        supplierGroupId: editingSupplier.supplierGroupId || '',
      });
    } else {
      form.reset({
        name: '',
        code: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        taxId: '',
        supplierGroupId: '',
      });
    }
  }, [editingSupplier, form, isDialogOpen]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockSuppliers: Supplier[] = [
        { 
          id: '1', 
          name: 'ABC Electronics', 
          code: 'SUP-001',
          contactPerson: 'John Smith',
          email: 'john@abcelectronics.com',
          phone: '555-1234',
          address: '123 Main St, Anytown, USA',
          taxId: 'TAX12345',
          supplierGroupId: '1',
          branchId: '1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        { 
          id: '2', 
          name: 'Global Distributors', 
          code: 'SUP-002',
          contactPerson: 'Jane Doe',
          email: 'jane@globaldist.com',
          phone: '555-5678',
          address: '456 Market St, Somewhere, USA',
          taxId: 'TAX67890',
          supplierGroupId: '2',
          branchId: '1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        { 
          id: '3', 
          name: 'Local Supplies Co', 
          code: 'SUP-003',
          contactPerson: 'Bob Johnson',
          email: 'bob@localsupplies.com',
          phone: '555-9012',
          address: '789 Oak St, Nowhere, USA',
          supplierGroupId: '3',
          branchId: '1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
      ];

      const mockGroups: SupplierGroup[] = [
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
      ];

      setSuppliers(mockSuppliers);
      setSupplierGroups(mockGroups);
      setLoading(false);
    }, 500);
  }, []);

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    supplier.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (supplier.contactPerson && supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (supplier.email && supplier.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const onSubmit = async (values: FormValues) => {
    if (editingSupplier) {
      const updatedSuppliers = suppliers.map(supplier => 
        supplier.id === editingSupplier.id 
          ? { 
              ...supplier, 
              ...values,
              updatedAt: new Date().toISOString() 
            } 
          : supplier
      );
      setSuppliers(updatedSuppliers);
      toast({
        title: 'Supplier updated',
        description: `Supplier "${values.name}" has been updated.`,
      });
    } else {
      const newSupplier: Supplier = {
        id: Math.random().toString(36).substring(7),
        name: values.name,
        code: values.code,
        contactPerson: values.contactPerson,
        email: values.email,
        phone: values.phone,
        address: values.address,
        taxId: values.taxId,
        supplierGroupId: values.supplierGroupId,
        branchId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setSuppliers([...suppliers, newSupplier]);
      toast({
        title: 'Supplier created',
        description: `Supplier "${values.name}" has been created.`,
      });
    }
    
    setIsDialogOpen(false);
    setEditingSupplier(null);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSuppliers(suppliers.filter(supplier => supplier.id !== id));
    toast({
      title: 'Supplier deleted',
      description: 'The supplier has been deleted successfully.',
    });
  };

  const handleAddSupplier = () => {
    setEditingSupplier(null);
    setIsDialogOpen(true);
  };

  const getSupplierGroupName = (groupId?: string) => {
    if (!groupId) return 'None';
    const group = supplierGroups.find(g => g.id === groupId);
    return group ? group.name : 'Unknown';
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Suppliers</h1>
            <p className="text-muted-foreground">
              Manage your suppliers and vendors
            </p>
          </div>
          
          <Button onClick={handleAddSupplier} size="sm">
            <Plus className="mr-2 h-4 w-4" /> Add Supplier
          </Button>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search suppliers..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Suppliers</CardTitle>
            <CardDescription>
              {filteredSuppliers.length} {filteredSuppliers.length === 1 ? 'supplier' : 'suppliers'} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-4">
                <p>Loading suppliers...</p>
              </div>
            ) : filteredSuppliers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-xs text-muted-foreground">
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Code</th>
                      <th className="px-4 py-2 text-left">Contact Person</th>
                      <th className="px-4 py-2 text-left">Group</th>
                      <th className="px-4 py-2 text-left">Contact</th>
                      <th className="px-4 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSuppliers.map((supplier) => (
                      <tr key={supplier.id} className="border-b">
                        <td className="px-4 py-3 font-medium">{supplier.name}</td>
                        <td className="px-4 py-3">{supplier.code}</td>
                        <td className="px-4 py-3">{supplier.contactPerson || '-'}</td>
                        <td className="px-4 py-3">{getSupplierGroupName(supplier.supplierGroupId)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {supplier.phone && (
                              <div className="flex items-center text-xs">
                                <Phone className="h-3 w-3 mr-1" />
                                {supplier.phone}
                              </div>
                            )}
                            {supplier.email && (
                              <div className="flex items-center text-xs">
                                <Mail className="h-3 w-3 mr-1" />
                                {supplier.email}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEdit(supplier)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500"
                              onClick={() => handleDelete(supplier.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-8">
                <p>No suppliers found matching your search.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={handleAddSupplier}
                >
                  <Plus className="mr-2 h-4 w-4" /> Create your first supplier
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
            <DialogDescription>
              {editingSupplier ? 'Update supplier details.' : 'Add a new supplier to your system.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="ABC Electronics" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code *</FormLabel>
                      <FormControl>
                        <Input placeholder="SUP-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contactPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person</FormLabel>
                      <FormControl>
                        <Input placeholder="John Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="supplierGroupId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier Group</FormLabel>
                      <FormControl>
                        <select 
                          className="w-full px-3 py-2 border rounded-md"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                        >
                          <option value="">None</option>
                          {supplierGroups.map(group => (
                            <option key={group.id} value={group.id}>
                              {group.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
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
                        <Input placeholder="555-1234" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St, Anytown, USA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="taxId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax ID</FormLabel>
                    <FormControl>
                      <Input placeholder="TAX12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingSupplier ? 'Update' : 'Create'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Suppliers;
