
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, FileText, Calendar, Filter, Download, Printer } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Mock data for invoices
const mockInvoices = [
  { id: 'INV-001', customer: 'Acme Corp', date: '2025-04-10', dueDate: '2025-04-24', total: 1299.99, status: 'Paid' },
  { id: 'INV-002', customer: 'Wayne Enterprises', date: '2025-04-09', dueDate: '2025-04-23', total: 2450.00, status: 'Pending' },
  { id: 'INV-003', customer: 'Stark Industries', date: '2025-04-08', dueDate: '2025-04-22', total: 3675.50, status: 'Paid' },
  { id: 'INV-004', customer: 'Daily Bugle', date: '2025-04-07', dueDate: '2025-04-21', total: 500.25, status: 'Overdue' },
  { id: 'INV-005', customer: 'Oscorp', date: '2025-04-06', dueDate: '2025-04-20', total: 1825.75, status: 'Paid' },
];

const SalesInvoices = () => {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState(mockInvoices);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = invoices.filter(invoice => 
    invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateInvoice = () => {
    toast({
      title: 'Feature not implemented',
      description: 'This feature will be available in a future update.',
    });
  };

  const handlePrintInvoice = (id: string) => {
    toast({
      title: 'Preparing invoice for printing',
      description: `Invoice ${id} will be printed.`,
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
            <p className="text-muted-foreground">
              Manage customer invoices and payments
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
            <Button size="sm" onClick={handleGenerateInvoice}>
              <Plus className="mr-2 h-4 w-4" /> New Invoice
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search invoices..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>
              {filteredInvoices.length} {filteredInvoices.length === 1 ? 'invoice' : 'invoices'} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-4">
                <p>Loading invoices...</p>
              </div>
            ) : filteredInvoices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-xs text-muted-foreground">
                      <th className="px-4 py-2 text-left">Invoice #</th>
                      <th className="px-4 py-2 text-left">Customer</th>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Due Date</th>
                      <th className="px-4 py-2 text-right">Total</th>
                      <th className="px-4 py-2 text-center">Status</th>
                      <th className="px-4 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b">
                        <td className="px-4 py-3 font-medium">{invoice.id}</td>
                        <td className="px-4 py-3">{invoice.customer}</td>
                        <td className="px-4 py-3">{invoice.date}</td>
                        <td className="px-4 py-3">{invoice.dueDate}</td>
                        <td className="px-4 py-3 text-right">${invoice.total.toFixed(2)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                            ${invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                            invoice.status === 'Pending' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'}`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-2">
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handlePrintInvoice(invoice.id)}
                            >
                              <Printer className="h-4 w-4" />
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
                <p>No invoices found matching your search.</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">Showing {filteredInvoices.length} of {invoices.length} invoices</div>
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

export default SalesInvoices;
