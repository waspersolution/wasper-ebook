
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, Download, Calendar, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for ledger accounts
const mockAccounts = [
  { id: '1', name: 'Cash', type: 'Asset', balance: 5000 },
  { id: '2', name: 'Accounts Receivable', type: 'Asset', balance: 2500 },
  { id: '3', name: 'Sales Revenue', type: 'Revenue', balance: 8000 },
  { id: '4', name: 'Rent Expense', type: 'Expense', balance: 1200 },
  { id: '5', name: 'Accounts Payable', type: 'Liability', balance: 3000 },
];

// Mock data for transactions
const mockTransactions = [
  { id: '1', date: '2025-04-10', account: 'Cash', description: 'Sales Invoice Payment', reference: 'INV-001', debit: 1299.99, credit: 0, balance: 5000 },
  { id: '2', date: '2025-04-09', account: 'Cash', description: 'Office Rent Payment', reference: 'EXP-001', debit: 0, credit: 1200, balance: 3700.01 },
  { id: '3', date: '2025-04-08', account: 'Cash', description: 'Customer Payment', reference: 'RCPT-001', debit: 500, credit: 0, balance: 4900.01 },
  { id: '4', date: '2025-04-07', account: 'Cash', description: 'Utility Bill Payment', reference: 'EXP-002', debit: 0, credit: 350, balance: 4450.01 },
  { id: '5', date: '2025-04-06', account: 'Cash', description: 'Cash Sales', reference: 'SALE-001', debit: 750, credit: 0, balance: 5200.01 },
];

const AccountingLedger = () => {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState(mockAccounts);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('accounts');

  const filteredAccounts = accounts.filter(account => 
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    account.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = selectedAccount 
    ? transactions.filter(txn => txn.account === accounts.find(acc => acc.id === selectedAccount)?.name)
    : transactions;

  const handleViewLedger = (accountId: string) => {
    setSelectedAccount(accountId);
    setActiveTab('transactions');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">General Ledger</h1>
            <p className="text-muted-foreground">
              Review accounts and transactions
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
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="accounts" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search accounts..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Chart of Accounts</CardTitle>
                <CardDescription>
                  {filteredAccounts.length} {filteredAccounts.length === 1 ? 'account' : 'accounts'} found
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center p-4">
                    <p>Loading accounts...</p>
                  </div>
                ) : filteredAccounts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-xs text-muted-foreground">
                          <th className="px-4 py-2 text-left">Account Name</th>
                          <th className="px-4 py-2 text-left">Type</th>
                          <th className="px-4 py-2 text-right">Balance</th>
                          <th className="px-4 py-2 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAccounts.map((account) => (
                          <tr key={account.id} className="border-b">
                            <td className="px-4 py-3 font-medium">{account.name}</td>
                            <td className="px-4 py-3">{account.type}</td>
                            <td className="px-4 py-3 text-right">${account.balance.toFixed(2)}</td>
                            <td className="px-4 py-3 text-center">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewLedger(account.id)}
                              >
                                <Eye className="mr-2 h-4 w-4" /> View Ledger
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <p>No accounts found matching your search.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transactions" className="space-y-4 pt-4">
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
              <div className="w-full md:w-64">
                <Select 
                  value={selectedAccount} 
                  onValueChange={setSelectedAccount}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Accounts</SelectItem>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search transactions..."
                  className="pl-8"
                />
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Transactions</CardTitle>
                <CardDescription>
                  {selectedAccount 
                    ? `Showing transactions for ${accounts.find(acc => acc.id === selectedAccount)?.name}` 
                    : 'Showing all transactions'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center p-4">
                    <p>Loading transactions...</p>
                  </div>
                ) : filteredTransactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-xs text-muted-foreground">
                          <th className="px-4 py-2 text-left">Date</th>
                          {!selectedAccount && <th className="px-4 py-2 text-left">Account</th>}
                          <th className="px-4 py-2 text-left">Description</th>
                          <th className="px-4 py-2 text-left">Reference</th>
                          <th className="px-4 py-2 text-right">Debit</th>
                          <th className="px-4 py-2 text-right">Credit</th>
                          <th className="px-4 py-2 text-right">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTransactions.map((txn) => (
                          <tr key={txn.id} className="border-b">
                            <td className="px-4 py-3">{txn.date}</td>
                            {!selectedAccount && <td className="px-4 py-3">{txn.account}</td>}
                            <td className="px-4 py-3">{txn.description}</td>
                            <td className="px-4 py-3">{txn.reference}</td>
                            <td className="px-4 py-3 text-right">
                              {txn.debit > 0 ? `$${txn.debit.toFixed(2)}` : ''}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {txn.credit > 0 ? `$${txn.credit.toFixed(2)}` : ''}
                            </td>
                            <td className="px-4 py-3 text-right font-medium">${txn.balance.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <p>No transactions found.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AccountingLedger;
