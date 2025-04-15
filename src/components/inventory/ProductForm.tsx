
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Product } from '@/types/inventory';

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().optional(),
  code: z.string().min(1, 'Code is required'),
  itemGroupId: z.string().min(1, 'Category is required'),
  category: z.string().optional(),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  stockQuantity: z.coerce.number().min(0, 'Quantity cannot be negative'),
  stock: z.coerce.number().optional(),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  initialValues?: Partial<Product>;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  onCancel,
  initialValues
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: initialValues?.id || undefined,
      name: initialValues?.name || '',
      sku: initialValues?.sku || '',
      code: initialValues?.code || '',
      itemGroupId: initialValues?.itemGroupId || '',
      category: initialValues?.category || '',
      price: initialValues?.price || 0,
      stockQuantity: initialValues?.stockQuantity || initialValues?.stock || 0,
      stock: initialValues?.stock || 0,
      description: initialValues?.description || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name *</FormLabel>
              <FormControl>
                <Input placeholder="Laptop" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code *</FormLabel>
                <FormControl>
                  <Input placeholder="LAP-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="itemGroupId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Clothing">Clothing</SelectItem>
                    <SelectItem value="Footwear">Footwear</SelectItem>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Office">Office</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price *</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="stockQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity *</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialValues?.id ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
