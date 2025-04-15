
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BarChart as BarChartIcon, PieChart, LineChart, Download, Calendar, Filter, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPreChart, Pie, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data for reports
const salesData = [
  { name: 'Jan', amount: 4000 },
  { name: 'Feb', amount: 5000 },
  { name: 'Mar', amount: 3000 },
  { name: 'Apr', amount: 7000 },
  { name: 'May', amount: 6000 },
  { name: 'Jun', amount: 8000 },
];

const expenseData = [
  { name: 'Rent', value: 2500 },
  { name: 'Salaries', value: 9000 },
  { name: 'Utilities', value: 1200 },
  { name: 'Inventory', value: 5500 },
  { name: 'Marketing', value: 2000 },
  { name: 'Other', value: 800 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Reports = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('sales');
  const [reportPeriod, setReportPeriod] = useState('monthly');

  const handleGeneratePDF = () => {
    toast({
      title: 'Feature in development',
      description: 'PDF report generation will be available in a future update.',
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">
              Business analytics and performance reports
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select defaultValue={reportPeriod} onValueChange={setReportPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" /> Date Range
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
            <Button onClick={handleGeneratePDF} size="sm">
              <FileText className="mr-2 h-4 w-4" /> Generate PDF
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <BarChartIcon className="h-4 w-4" /> Sales
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" /> Expenses
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" /> Inventory
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle>Sales Performance</CardTitle>
                  <CardDescription>Monthly sales revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                        <Legend />
                        <Bar dataKey="amount" name="Sales" fill="#4f46e5" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Sales Summary</CardTitle>
                  <CardDescription>Current {reportPeriod} totals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-muted rounded-lg p-4">
                      <div className="text-sm font-medium text-muted-foreground">Total Sales</div>
                      <div className="text-2xl font-bold">$33,000</div>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <div className="text-sm font-medium text-muted-foreground">Orders</div>
                      <div className="text-2xl font-bold">245</div>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <div className="text-sm font-medium text-muted-foreground">Average Sale</div>
                      <div className="text-2xl font-bold">$134.69</div>
                    </div>
                    <Button className="w-full" variant="outline">
                      <Download className="mr-2 h-4 w-4" /> Download CSV
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="expenses" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle>Expense Breakdown</CardTitle>
                  <CardDescription>By category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPreChart>
                        <Pie
                          data={expenseData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {expenseData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                        <Legend />
                      </RechartsPreChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Expense Summary</CardTitle>
                  <CardDescription>Current {reportPeriod} totals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-muted rounded-lg p-4">
                      <div className="text-sm font-medium text-muted-foreground">Total Expenses</div>
                      <div className="text-2xl font-bold">$21,000</div>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <div className="text-sm font-medium text-muted-foreground">Largest Category</div>
                      <div className="text-2xl font-bold">Salaries</div>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <div className="text-sm font-medium text-muted-foreground">Net Profit</div>
                      <div className="text-2xl font-bold">$12,000</div>
                    </div>
                    <Button className="w-full" variant="outline">
                      <Download className="mr-2 h-4 w-4" /> Download CSV
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="inventory" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle>Inventory Status</CardTitle>
                  <CardDescription>Current stock levels by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">Inventory charts will be available in a future update.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Summary</CardTitle>
                  <CardDescription>Stock overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-muted rounded-lg p-4">
                      <div className="text-sm font-medium text-muted-foreground">Total Items</div>
                      <div className="text-2xl font-bold">512</div>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <div className="text-sm font-medium text-muted-foreground">Low Stock Items</div>
                      <div className="text-2xl font-bold text-amber-500">24</div>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <div className="text-sm font-medium text-muted-foreground">Out of Stock</div>
                      <div className="text-2xl font-bold text-red-500">8</div>
                    </div>
                    <Button className="w-full" variant="outline">
                      <Download className="mr-2 h-4 w-4" /> Download CSV
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Reports;
