
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Filter, Download, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Mock data for journal entries
const mockEntries = [
  { 
    id: 'JE-001', 
    date: '2025-04-10', 
    reference: 'INV-001', 
    description: 'Sales Invoice', 
    debitTotal: 1299.99, 
    creditTotal: 1299.99, 
    status: 'Posted' 
  },
  { 
    id: 'JE-002', 
    date: '2025-04-09', 
    reference: 'BILL-001', 
    description: 'Purchase Bill Payment', 
    debitTotal: 2599.98, 
    creditTotal: 2599.98, 
    status: 'Posted' 
  },
  { 
    id: 'JE-003', 
    date: '2025-04-08', 
    reference: 'EXP-001', 
    description: 'Office Expense', 
    debitTotal: 450.75, 
    creditTotal: 450.75, 
    status: 'Posted' 
  },
  { 
    id: 'JE-004', 
    date: '2025-04-07', 
    reference: 'PAYROLL-001', 
    description: 'Monthly Payroll', 
    debitTotal: 5325.50, 
    creditTotal: 5325.50, 
    status: 'Draft' 
  },
  { 
    id: 'JE-005', 
    date: '2025-04-06', 
    reference: 'ADJ-001', 
    description: 'Inventory Adjustment', 
    debitTotal: 1200.25, 
    creditTotal: 1200.25, 
    status: 'Posted' 
  },
];

const AccountingJournal = () => {
  const { toast } = useToast();
  const [entries, setEntries] = useState(mockEntries);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEntries = entries.filter(entry => 
    entry.reference.toLowerCase().includes(searchTerm.toLowerCase()) || 
    entry.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEntry = () => {
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
            <h1 className="text-2xl font-bold tracking-tight">Journal Entries</h1>
            <p className="text-muted-foreground">
              Manage general ledger entries and transactions
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
            <Button size="sm" onClick={handleAddEntry}>
              <Plus className="mr-2 h-4 w-4" /> New Entry
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search entries..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Journal Entries</CardTitle>
            <CardDescription>
              {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-4">
                <p>Loading journal entries...</p>
              </div>
            ) : filteredEntries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-xs text-muted-foreground">
                      <th className="px-4 py-2 text-left">Entry #</th>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Reference</th>
                      <th className="px-4 py-2 text-left">Description</th>
                      <th className="px-4 py-2 text-right">Debit</th>
                      <th className="px-4 py-2 text-right">Credit</th>
                      <th className="px-4 py-2 text-center">Status</th>
                      <th className="px-4 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEntries.map((entry) => (
                      <tr key={entry.id} className="border-b">
                        <td className="px-4 py-3 font-medium">{entry.id}</td>
                        <td className="px-4 py-3">{entry.date}</td>
                        <td className="px-4 py-3">{entry.reference}</td>
                        <td className="px-4 py-3">{entry.description}</td>
                        <td className="px-4 py-3 text-right">${entry.debitTotal.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right">${entry.creditTotal.toFixed(2)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                            ${entry.status === 'Posted' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {entry.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-4">
                <p>No journal entries found matching your search.</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">Showing {filteredEntries.length} of {entries.length} entries</div>
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

export default AccountingJournal;
