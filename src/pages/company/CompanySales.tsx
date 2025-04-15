
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart,
  Line
} from 'recharts';
import { 
  Filter, 
  Download, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Company {
  id: string;
  name: string;
}

// Sample sales data
const sampleMonthlySales = [
  { name: 'Jan', sales: 4000, returns: 400 },
  { name: 'Feb', sales: 5000, returns: 300 },
  { name: 'Mar', sales: 3000, returns: 500 },
  { name: 'Apr', sales: 7000, returns: 600 },
  { name: 'May', sales: 6000, returns: 400 },
  { name: 'Jun', sales: 8000, returns: 500 },
];

const sampleProductSales = [
  { name: 'Electronics', sales: 12000 },
  { name: 'Clothing', sales: 8000 },
  { name: 'Home Goods', sales: 5000 },
  { name: 'Toys', sales: 3000 },
  { name: 'Office', sales: 2000 },
];

const sampleDailySales = [
  { name: '1', sales: 800 },
  { name: '2', sales: 950 },
  { name: '3', sales: 1100 },
  { name: '4', sales: 900 },
  { name: '5', sales: 1200 },
  { name: '6', sales: 1300 },
  { name: '7', sales: 700 },
  { name: '8', sales: 800 },
  { name: '9', sales: 950 },
  { name: '10', sales: 1000 },
];

const recentSales = [
  { id: 'INV-001', customer: 'John Smith', date: '2025-04-12', amount: 299.99, status: 'Paid' },
  { id: 'INV-002', customer: 'Jane Doe', date: '2025-04-11', amount: 149.50, status: 'Paid' },
  { id: 'INV-003', customer: 'Robert Brown', date: '2025-04-11', amount: 79.99, status: 'Pending' },
  { id: 'INV-004', customer: 'Sarah Wilson', date: '2025-04-10', amount: 399.95, status: 'Paid' },
  { id: 'INV-005', customer: 'Michael Lee', date: '2025-04-09', amount: 199.00, status: 'Refunded' },
];

const CompanySales = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const { toast } = useToast();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

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
  
  if (loading || !company) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p>Loading sales data...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{company.name} - Sales</h1>
            <p className="text-muted-foreground">
              Analyze sales performance and manage transactions
            </p>
          </div>
          
          <div className="flex gap-2">
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
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" /> New Sale
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <CardDescription>Current Month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$33,299.45</div>
              <div className="flex items-center mt-1 text-xs">
                <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500 font-medium">12%</span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Sales Count</CardTitle>
              <CardDescription>Current Month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">245</div>
              <div className="flex items-center mt-1 text-xs">
                <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500 font-medium">8%</span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
              <CardDescription>Current Month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$135.92</div>
              <div className="flex items-center mt-1 text-xs">
                <ArrowDownRight className="h-3 w-3 mr-1 text-red-500" />
                <span className="text-red-500 font-medium">3%</span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales Analysis</CardTitle>
            <CardDescription>Sales vs Returns (last 6 months)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sampleMonthlySales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" name="Sales" fill="#4f46e5" />
                  <Bar dataKey="returns" name="Returns" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Product Category</CardTitle>
              <CardDescription>Current month breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={sampleProductSales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                    <Bar dataKey="sales" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daily Sales Trend</CardTitle>
              <CardDescription>Last 10 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sampleDailySales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#4f46e5"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>Latest transactions</CardDescription>
            </div>
            <div className="relative w-64">
              <Input type="search" placeholder="Search invoices..." className="pl-8" />
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-xs text-muted-foreground">
                    <th className="px-4 py-2 text-left">Invoice</th>
                    <th className="px-4 py-2 text-left">Customer</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-right">Amount</th>
                    <th className="px-4 py-2 text-center">Status</th>
                    <th className="px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSales.map((sale) => (
                    <tr key={sale.id} className="border-b">
                      <td className="px-4 py-3 font-medium">{sale.id}</td>
                      <td className="px-4 py-3">{sale.customer}</td>
                      <td className="px-4 py-3">{sale.date}</td>
                      <td className="px-4 py-3 text-right">${sale.amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                          ${sale.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                            sale.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {sale.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button variant="ghost" size="sm">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">Showing 5 of 245 records</div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default CompanySales;

// Add missing import for Search icon
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
