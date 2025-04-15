
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, FileText, Calendar, Filter, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data for sales orders
const mockSalesOrders = [
  { id: 'SO-001', customer: 'Acme Corp', date: '2025-04-10', total: 1299.99, status: 'Processing' },
  { id: 'SO-002', customer: 'Wayne Enterprises', date: '2025-04-09', total: 2450.00, status: 'Shipped' },
  { id: 'SO-003', customer: 'Stark Industries', date: '2025-04-08', total: 3675.50, status: 'Delivered' },
  { id: 'SO-004', customer: 'Daily Bugle', date: '2025-04-07', total: 500.25, status: 'Processing' },
  { id: 'SO-005', customer: 'Oscorp', date: '2025-04-06', total: 1825.75, status: 'Cancelled' },
];

// Mock data for customers and products
const mockCustomers = [
  { id: '1', name: 'Acme Corp' },
  { id: '2', name: 'Wayne Enterprises' },
  { id: '3', name: 'Stark Industries' },
  { id: '4', name: 'Daily Bugle' },
  { id: '5', name: 'Oscorp' },
];

const mockProducts = [
  { id: '1', name: 'Laptop', price: 999.99 },
  { id: '2', name: 'Smartphone', price: 499.99 },
  { id: '3', name: 'Tablet', price: 349.99 },
  { id: '4', name: 'Desktop Computer', price: 1299.99 },
  { id: '5', name: 'Monitor', price: 249.99 },
];

const formSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  products: z.array(
    z.object({
      productId: z.string().min(1, 'Product is required'),
      quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
    })
  ).min(1, 'At least one product is required'),
});

type FormValues = z.infer<typeof formSchema>;

const SalesOrders = () => {
  const { toast } = useToast();
  const [salesOrders, setSalesOrders] = useState(mockSalesOrders);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([{ productId: '', quantity: 1 }]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerId: '',
      products: [{ productId: '', quantity: 1 }],
    },
  });

  const filteredOrders = salesOrders.filter(order => 
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = async (values: FormValues) => {
    // In a real application, this would connect to your database
    // For now, we'll just add a mock order
    const newOrder = {
      id: `SO-00${salesOrders.length + 1}`,
      customer: mockCustomers.find(c => c.id === values.customerId)?.name || 'Unknown',
      date: new Date().toISOString().split('T')[0],
      total: values.products.reduce((sum, product) => {
        const productPrice = mockProducts.find(p => p.id === product.productId)?.price || 0;
        return sum + (productPrice * product.quantity);
      }, 0),
      status: 'Processing',
    };
    
    setSalesOrders([newOrder, ...salesOrders]);
    
    toast({
      title: 'Sales order created',
      description: `Sales order ${newOrder.id} has been created.`,
    });
    
    setIsDialogOpen(false);
    form.reset();
    setSelectedProducts([{ productId: '', quantity: 1 }]);
  };

  const addProductField = () => {
    setSelectedProducts([...selectedProducts, { productId: '', quantity: 1 }]);
    const currentProducts = form.getValues('products');
    form.setValue('products', [...currentProducts, { productId: '', quantity: 1 }]);
  };

  const removeProductField = (index: number) => {
    if (selectedProducts.length === 1) {
      return; // Don't remove the last product field
    }
    
    const updatedProducts = [...selectedProducts];
    updatedProducts.splice(index, 1);
    setSelectedProducts(updatedProducts);
    
    const currentProducts = form.getValues('products');
    currentProducts.splice(index, 1);
    form.setValue('products', currentProducts);
  };

  const handleQuantityChange = (index: number, value: number) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index].quantity = value;
    setSelectedProducts(updatedProducts);
    
    form.setValue(`products.${index}.quantity`, value);
  };

  const handleProductChange = (index: number, value: string) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index].productId = value;
    setSelectedProducts(updatedProducts);
    
    form.setValue(`products.${index}.productId`, value);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sales Orders</h1>
            <p className="text-muted-foreground">
              Manage and track customer sales orders
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Apr 2025</span>
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button size="sm" onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> New Sales Order
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search orders..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sales Orders</CardTitle>
            <CardDescription>
              {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-4">
                <p>Loading sales orders...</p>
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-xs text-muted-foreground">
                      <th className="px-4 py-2 text-left">Order ID</th>
                      <th className="px-4 py-2 text-left">Customer</th>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-right">Total</th>
                      <th className="px-4 py-2 text-center">Status</th>
                      <th className="px-4 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b">
                        <td className="px-4 py-3 font-medium">{order.id}</td>
                        <td className="px-4 py-3">{order.customer}</td>
                        <td className="px-4 py-3">{order.date}</td>
                        <td className="px-4 py-3 text-right">${order.total.toFixed(2)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                            ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                            order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'Shipped' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button variant="ghost" size="sm">
                            <FileText className="mr-2 h-4 w-4" /> View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-4">
                <p>No sales orders found matching your search.</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">Showing {filteredOrders.length} of {salesOrders.length} orders</div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* New Sales Order Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Sales Order</DialogTitle>
            <DialogDescription>
              Create a new sales order for a customer.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockCustomers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Products *</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addProductField}>
                    <Plus className="h-4 w-4 mr-1" /> Add Product
                  </Button>
                </div>
                
                {selectedProducts.map((product, index) => (
                  <div key={index} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <FormItem>
                        <FormLabel className={index > 0 ? "sr-only" : undefined}>Product</FormLabel>
                        <Select 
                          value={product.productId} 
                          onValueChange={(value) => handleProductChange(index, value)}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a product" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockProducts.map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.name} - ${p.price.toFixed(2)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    </div>
                    
                    <div className="w-24">
                      <FormItem>
                        <FormLabel className={index > 0 ? "sr-only" : undefined}>Qty</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            value={product.quantity} 
                            onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </div>
                    
                    {selectedProducts.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500"
                        onClick={() => removeProductField(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Order</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default SalesOrders;
