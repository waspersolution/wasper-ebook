
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, RefreshCw, Search, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define ledger interface that matches our mock data
interface Ledger {
  id: string;
  name: string;
  type: string;
  balance: number;
}

// Mock data for ledgers
const mockLedgers: Ledger[] = [
  { id: '1', name: 'Cash', type: 'Asset', balance: 5000 },
  { id: '2', name: 'Accounts Receivable', type: 'Asset', balance: 2500 },
  { id: '3', name: 'Sales Revenue', type: 'Revenue', balance: 8000 },
  { id: '4', name: 'Rent Expense', type: 'Expense', balance: 1200 },
  { id: '5', name: 'Accounts Payable', type: 'Liability', balance: 3000 },
];

const formSchema = z.object({
  name: z.string().min(1, 'Ledger name is required'),
  type: z.string().min(1, 'Ledger type is required'),
  balance: z.coerce.number().min(0, 'Balance must be a positive number'),
});

type FormValues = z.infer<typeof formSchema>;

const LedgerManagement = () => {
  const { toast } = useToast();
  const [ledgers, setLedgers] = useState<Ledger[]>(mockLedgers);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLedger, setEditingLedger] = useState<Ledger | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: '',
      balance: 0,
    },
  });

  // Reset form when dialog opens or changes between add/edit
  React.useEffect(() => {
    if (editingLedger) {
      form.reset({
        name: editingLedger.name,
        type: editingLedger.type,
        balance: editingLedger.balance,
      });
    } else {
      form.reset({
        name: '',
        type: '',
        balance: 0,
      });
    }
  }, [editingLedger, form, isDialogOpen]);

  const filteredLedgers = ledgers.filter(ledger => 
    ledger.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    ledger.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = async (values: FormValues) => {
    if (editingLedger) {
      // Update existing ledger
      const updatedLedgers = ledgers.map(ledger => 
        ledger.id === editingLedger.id ? { ...ledger, ...values } : ledger
      );
      setLedgers(updatedLedgers);
      toast({
        title: 'Ledger updated',
        description: `Ledger "${values.name}" has been updated.`,
      });
    } else {
      // Add new ledger - ensure all required fields are included
      const newLedger: Ledger = {
        id: Math.random().toString(36).substring(7),
        name: values.name,
        type: values.type,
        balance: values.balance
      };
      setLedgers([...ledgers, newLedger]);
      toast({
        title: 'Ledger created',
        description: `Ledger "${values.name}" has been created.`,
      });
    }
    
    setIsDialogOpen(false);
    setEditingLedger(null);
  };

  const handleEdit = (ledger: any) => {
    setEditingLedger(ledger);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setLedgers(ledgers.filter(ledger => ledger.id !== id));
    toast({
      title: 'Ledger deleted',
      description: 'The ledger has been deleted successfully.',
    });
  };

  const handleAddLedger = () => {
    setEditingLedger(null);
    setIsDialogOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Ledger Management</h1>
            <p className="text-muted-foreground">
              Manage accounting ledgers and accounts
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
            <Button size="sm" onClick={handleAddLedger}>
              <Plus className="mr-2 h-4 w-4" /> Add Ledger
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search ledgers..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ledgers</CardTitle>
            <CardDescription>
              {filteredLedgers.length} {filteredLedgers.length === 1 ? 'ledger' : 'ledgers'} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-4">
                <p>Loading ledgers...</p>
              </div>
            ) : filteredLedgers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-xs text-muted-foreground">
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-right">Balance</th>
                      <th className="px-4 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLedgers.map((ledger) => (
                      <tr key={ledger.id} className="border-b">
                        <td className="px-4 py-3 font-medium">{ledger.name}</td>
                        <td className="px-4 py-3">{ledger.type}</td>
                        <td className="px-4 py-3 text-right">${ledger.balance.toFixed(2)}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(ledger)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500 hover:bg-red-50"
                              onClick={() => handleDelete(ledger.id)}
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
              <div className="text-center p-4">
                <p>No ledgers found matching your search.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Ledger Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingLedger ? 'Edit Ledger' : 'Add New Ledger'}</DialogTitle>
            <DialogDescription>
              {editingLedger ? 'Update ledger information.' : 'Add a new ledger account.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ledger Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Cash" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a ledger type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Asset">Asset</SelectItem>
                        <SelectItem value="Liability">Liability</SelectItem>
                        <SelectItem value="Equity">Equity</SelectItem>
                        <SelectItem value="Revenue">Revenue</SelectItem>
                        <SelectItem value="Expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="balance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opening Balance</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingLedger ? 'Update' : 'Create'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default LedgerManagement;
