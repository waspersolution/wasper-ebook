
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowDownUp, Search, Filter, Download, Undo, ArrowUp, ArrowDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Mock data for products
const mockProducts = [
  { id: '1', name: 'Laptop', sku: 'LAP-001', category: 'Electronics', quantity: 15, reorderLevel: 5 },
  { id: '2', name: 'Smartphone', sku: 'PHN-001', category: 'Electronics', quantity: 25, reorderLevel: 10 },
  { id: '3', name: 'Tablet', sku: 'TAB-001', category: 'Electronics', quantity: 3, reorderLevel: 5 },
  { id: '4', name: 'Desktop Computer', sku: 'DSK-001', category: 'Electronics', quantity: 5, reorderLevel: 3 },
  { id: '5', name: 'Monitor', sku: 'MON-001', category: 'Electronics', quantity: 0, reorderLevel: 5 },
];

const formSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  adjustmentType: z.enum(['increase', 'decrease']),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  reason: z.string().min(1, 'Reason is required'),
});

type FormValues = z.infer<typeof formSchema>;

const InventoryStock = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdjustmentDialogOpen, setIsAdjustmentDialogOpen] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: '',
      adjustmentType: 'increase',
      quantity: 1,
      reason: '',
    },
  });

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = async (values: FormValues) => {
    // In a real application, this would connect to your database
    const updatedProducts = products.map(product => {
      if (product.id === values.productId) {
        const newQuantity = values.adjustmentType === 'increase' 
          ? product.quantity + values.quantity
          : Math.max(0, product.quantity - values.quantity);
          
        return { ...product, quantity: newQuantity };
      }
      return product;
    });
    
    setProducts(updatedProducts);
    
    const productName = products.find(p => p.id === values.productId)?.name || 'Unknown product';
    
    toast({
      title: 'Inventory adjusted',
      description: `${productName} quantity ${values.adjustmentType === 'increase' ? 'increased' : 'decreased'} by ${values.quantity}.`,
    });
    
    setIsAdjustmentDialogOpen(false);
    form.reset();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Stock Management</h1>
            <p className="text-muted-foreground">
              Monitor and adjust inventory stock levels
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button size="sm" onClick={() => setIsAdjustmentDialogOpen(true)}>
              <ArrowDownUp className="mr-2 h-4 w-4" /> Adjust Stock
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Stock</CardTitle>
            <CardDescription>
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-4">
                <p>Loading stock data...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-xs text-muted-foreground">
                      <th className="px-4 py-2 text-left">Product</th>
                      <th className="px-4 py-2 text-left">SKU</th>
                      <th className="px-4 py-2 text-left">Category</th>
                      <th className="px-4 py-2 text-right">Current Qty</th>
                      <th className="px-4 py-2 text-right">Reorder Level</th>
                      <th className="px-4 py-2 text-center">Status</th>
                      <th className="px-4 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b">
                        <td className="px-4 py-3 font-medium">{product.name}</td>
                        <td className="px-4 py-3">{product.sku}</td>
                        <td className="px-4 py-3">{product.category}</td>
                        <td className="px-4 py-3 text-right">{product.quantity}</td>
                        <td className="px-4 py-3 text-right">{product.reorderLevel}</td>
                        <td className="px-4 py-3 text-center">
                          {product.quantity === 0 ? (
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800">
                              Out of Stock
                            </span>
                          ) : product.quantity <= product.reorderLevel ? (
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-800">
                              Low Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                              In Stock
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              form.setValue('productId', product.id);
                              setIsAdjustmentDialogOpen(true);
                            }}
                          >
                            <ArrowDownUp className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-4">
                <p>No products found matching your search.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stock Adjustment Dialog */}
      <Dialog open={isAdjustmentDialogOpen} onOpenChange={setIsAdjustmentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adjust Stock</DialogTitle>
            <DialogDescription>
              Increase or decrease product inventory levels.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Product *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} ({product.sku}) - Current: {product.quantity}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="adjustmentType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Adjustment Type *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="increase" id="increase" />
                          <label htmlFor="increase" className="flex items-center gap-1 text-sm font-medium">
                            <ArrowUp className="h-4 w-4 text-green-600" /> Increase Stock
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="decrease" id="decrease" />
                          <label htmlFor="decrease" className="flex items-center gap-1 text-sm font-medium">
                            <ArrowDown className="h-4 w-4 text-red-600" /> Decrease Stock
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity *</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" step="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="purchase">New Purchase</SelectItem>
                        <SelectItem value="sale">Sale</SelectItem>
                        <SelectItem value="return">Customer Return</SelectItem>
                        <SelectItem value="damaged">Damaged/Expired</SelectItem>
                        <SelectItem value="correction">Inventory Correction</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAdjustmentDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Adjust Inventory</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default InventoryStock;
