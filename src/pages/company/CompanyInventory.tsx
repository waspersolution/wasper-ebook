
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Filter, 
  Download, 
  Package, 
  ArrowDownRight,
  AlertCircle,
  Truck,
  PlusCircle,
  BarChart4,
  RefreshCw
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Company {
  id: string;
  name: string;
}

// Sample inventory data for demonstration
const sampleInventoryData = [
  { id: 1, code: 'EL-001', name: 'Smartphone X', category: 'Electronics', stock: 25, price: 599.99, status: 'In Stock' },
  { id: 2, code: 'EL-002', name: 'Tablet Pro', category: 'Electronics', stock: 12, price: 399.99, status: 'Low Stock' },
  { id: 3, code: 'CL-001', name: 'Summer T-Shirt', category: 'Clothing', stock: 85, price: 24.99, status: 'In Stock' },
  { id: 4, code: 'CL-002', name: 'Winter Jacket', category: 'Clothing', stock: 0, price: 89.99, status: 'Out of Stock' },
  { id: 5, code: 'HG-001', name: 'Coffee Maker', category: 'Home Goods', stock: 8, price: 79.99, status: 'Low Stock' },
  { id: 6, code: 'HG-002', name: 'Toaster', category: 'Home Goods', stock: 15, price: 49.99, status: 'In Stock' },
  { id: 7, code: 'OF-001', name: 'Desk Lamp', category: 'Office', stock: 32, price: 39.99, status: 'In Stock' },
  { id: 8, code: 'TO-001', name: 'Building Blocks', category: 'Toys', stock: 9, price: 29.99, status: 'Low Stock' },
];

// Data for inventory by category chart
const inventoryByCategory = [
  { name: 'Electronics', value: 37 },
  { name: 'Clothing', value: 85 },
  { name: 'Home Goods', value: 23 },
  { name: 'Office', value: 32 },
  { name: 'Toys', value: 9 },
];

// Data for inventory value chart
const inventoryValueByCategory = [
  { name: 'Electronics', value: 22499 },
  { name: 'Clothing', value: 12749 },
  { name: 'Home Goods', value: 7499 },
  { name: 'Office', value: 4999 },
  { name: 'Toys', value: 2999 },
];

// Chart colors
const COLORS = ['#4f46e5', '#10b981', '#f97316', '#6366f1', '#f43f5e'];

const CompanyInventory = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const { toast } = useToast();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!companyId) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch company details
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('id, name')
          .eq('id', companyId)
          .single();
        
        if (companyError) throw companyError;
        setCompany(companyData);
        
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to load data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [companyId, toast]);

  const filteredInventory = sampleInventoryData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = inventoryByCategory.reduce((sum, item) => sum + item.value, 0);
  const lowStockItems = sampleInventoryData.filter(item => item.status === 'Low Stock').length;
  const outOfStockItems = sampleInventoryData.filter(item => item.status === 'Out of Stock').length;
  const inventoryValue = sampleInventoryData.reduce((sum, item) => sum + (item.stock * item.price), 0);
  
  if (loading || !company) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p>Loading inventory data...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{company.name} - Inventory</h1>
            <p className="text-muted-foreground">
              Manage products, stock levels, and inventory valuation
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
              <p className="text-xs text-muted-foreground">Across {inventoryByCategory.length} categories</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">{lowStockItems}</div>
              <p className="text-xs text-muted-foreground">Items below minimum threshold</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{outOfStockItems}</div>
              <p className="text-xs text-muted-foreground">Items requiring reorder</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${inventoryValue.toFixed(2)}</div>
              <div className="flex items-center mt-1 text-xs">
                <ArrowDownRight className="h-3 w-3 mr-1 text-red-500" />
                <span className="text-red-500 font-medium">5%</span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory by Category</CardTitle>
              <CardDescription>Number of products by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={inventoryByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {inventoryByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} items`, 'Quantity']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Value by Category</CardTitle>
              <CardDescription>Value distribution ($)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={inventoryValueByCategory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Value']} />
                    <Bar dataKey="value" fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Current Inventory</CardTitle>
              <CardDescription>Manage your product stock levels</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-xs text-muted-foreground">
                    <th className="px-4 py-2 text-left">Code</th>
                    <th className="px-4 py-2 text-left">Product</th>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-right">Stock</th>
                    <th className="px-4 py-2 text-right">Price</th>
                    <th className="px-4 py-2 text-center">Status</th>
                    <th className="px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="px-4 py-3 font-mono text-sm">{item.code}</td>
                      <td className="px-4 py-3 font-medium">{item.name}</td>
                      <td className="px-4 py-3">{item.category}</td>
                      <td className="px-4 py-3 text-right">{item.stock}</td>
                      <td className="px-4 py-3 text-right">${item.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={
                          item.status === 'In Stock' ? 'default' : 
                          item.status === 'Low Stock' ? 'secondary' : 
                          'destructive'
                        }>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <Button variant="ghost" size="icon" title="Restock">
                            <Truck className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Analytics">
                            <BarChart4 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">Showing {filteredInventory.length} of {sampleInventoryData.length} products</div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </CardFooter>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-amber-800">
              <AlertCircle className="h-5 w-5 mr-2" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-800 mb-3">The following items are running low and may need reordering:</p>
            <ul className="space-y-1">
              {sampleInventoryData
                .filter(item => item.status === 'Low Stock')
                .map(item => (
                  <li key={item.id} className="flex items-center justify-between border-b border-amber-200 pb-2">
                    <span className="font-medium text-amber-900">{item.name} <span className="text-xs">({item.code})</span></span>
                    <div className="flex items-center gap-4">
                      <span className="text-amber-800">Stock: {item.stock}</span>
                      <Button variant="outline" size="sm" className="h-8 border-amber-400 bg-amber-100 hover:bg-amber-200 text-amber-900">
                        Reorder
                      </Button>
                    </div>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CompanyInventory;

// Add missing Search icon function
function Search(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

// Add missing Edit icon function
function Edit(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}
