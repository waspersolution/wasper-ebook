
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, FileText, Calendar, Filter, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Mock data for purchase bills
const mockBills = [
  { id: 'BILL-001', supplier: 'Tech Supplies Inc', date: '2025-04-10', dueDate: '2025-04-25', total: 2599.98, status: 'Paid' },
  { id: 'BILL-002', supplier: 'Office Depot', date: '2025-04-09', dueDate: '2025-04-24', total: 450.75, status: 'Pending' },
  { id: 'BILL-003', supplier: 'Global Electronics', date: '2025-04-08', dueDate: '2025-04-23', total: 3275.50, status: 'Paid' },
  { id: 'BILL-004', supplier: 'Furniture Plus', date: '2025-04-07', dueDate: '2025-04-22', total: 1200.25, status: 'Overdue' },
  { id: 'BILL-005', supplier: 'Paper Co', date: '2025-04-06', dueDate: '2025-04-21', total: 325.75, status: 'Pending' },
];

const PurchaseBills = () => {
  const { toast } = useToast();
  const [bills, setBills] = useState(mockBills);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBills = bills.filter(bill => 
    bill.supplier.toLowerCase().includes(searchTerm.toLowerCase()) || 
    bill.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddBill = () => {
    toast({
      title: 'Feature in development',
      description: 'This feature will be available in a future update.',
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Purchase Bills</h1>
            <p className="text-muted-foreground">
              Manage and track bills from suppliers
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
            <Button size="sm" onClick={handleAddBill}>
              <Plus className="mr-2 h-4 w-4" /> Add Bill
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search bills..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Purchase Bills</CardTitle>
            <CardDescription>
              {filteredBills.length} {filteredBills.length === 1 ? 'bill' : 'bills'} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-4">
                <p>Loading bills...</p>
              </div>
            ) : filteredBills.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-xs text-muted-foreground">
                      <th className="px-4 py-2 text-left">Bill #</th>
                      <th className="px-4 py-2 text-left">Supplier</th>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Due Date</th>
                      <th className="px-4 py-2 text-right">Total</th>
                      <th className="px-4 py-2 text-center">Status</th>
                      <th className="px-4 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBills.map((bill) => (
                      <tr key={bill.id} className="border-b">
                        <td className="px-4 py-3 font-medium">{bill.id}</td>
                        <td className="px-4 py-3">{bill.supplier}</td>
                        <td className="px-4 py-3">{bill.date}</td>
                        <td className="px-4 py-3">{bill.dueDate}</td>
                        <td className="px-4 py-3 text-right">${bill.total.toFixed(2)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                            ${bill.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                            bill.status === 'Pending' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'}`}>
                            {bill.status}
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
                <p>No bills found matching your search.</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">Showing {filteredBills.length} of {bills.length} bills</div>
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

export default PurchaseBills;
