
import React, { useEffect, useState } from 'react';
import { SaleTransaction } from '@/services/types';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecentTransactionsProps {
  branchId: string;
  className?: string; // Added className prop
}

// Sample transactions data - in a real app, this would come from an API
const sampleTransactions: SaleTransaction[] = [
  {
    id: 'INV-001',
    date: '2023-04-10T14:30:00',
    customerId: 'C001',
    customerName: 'John Smith',
    total: 5600,
    status: 'completed',
    paymentMethod: 'credit_card',
    companyId: 'company-1',
    branchId: 'branch-1'
  },
  {
    id: 'INV-002',
    date: '2023-04-09T11:15:00',
    customerId: 'C002',
    customerName: 'Emma Johnson',
    total: 2300,
    status: 'pending',
    paymentMethod: 'upi',
    companyId: 'company-1',
    branchId: 'branch-1'
  },
  {
    id: 'INV-003',
    date: '2023-04-08T16:45:00',
    customerId: 'C003',
    customerName: 'Michael Brown',
    total: 8900,
    status: 'completed',
    paymentMethod: 'cash',
    companyId: 'company-1',
    branchId: 'branch-1'
  },
  {
    id: 'INV-004',
    date: '2023-04-07T09:30:00',
    customerId: 'C004',
    customerName: 'Sarah Davis',
    total: 1200,
    status: 'cancelled',
    paymentMethod: 'bank_transfer',
    companyId: 'company-1',
    branchId: 'branch-1'
  },
];

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ branchId, className }) => {
  const [transactions, setTransactions] = useState<SaleTransaction[]>([]);
  
  useEffect(() => {
    // In a real implementation, we would fetch transactions based on the branchId
    // For example:
    // fetchTransactionsForBranch(branchId).then(data => setTransactions(data));
    console.log(`Fetching transactions for branch ID: ${branchId}`);
    
    // For now, we're using sample data
    setTransactions(sampleTransactions);
  }, [branchId]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-success-500" />;
      case 'pending':
        return <AlertCircle size={16} className="text-warning-500" />;
      case 'cancelled':
        return <XCircle size={16} className="text-danger-500" />;
      default:
        return null;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success-50 text-success-700 border-success-200';
      case 'pending':
        return 'bg-warning-50 text-warning-700 border-warning-200';
      case 'cancelled':
        return 'bg-danger-50 text-danger-700 border-danger-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className={cn("wasper-card p-6", className)}>
      <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Invoice</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Customer</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Date</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Amount</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Payment Method</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-border hover:bg-muted/50">
                <td className="py-3 px-2">{transaction.id}</td>
                <td className="py-3 px-2">{transaction.customerName}</td>
                <td className="py-3 px-2">{formatDate(transaction.date)}</td>
                <td className="py-3 px-2 font-medium">{formatCurrency(transaction.total)}</td>
                <td className="py-3 px-2">{transaction.paymentMethod}</td>
                <td className="py-3 px-2">
                  <div className="flex items-center">
                    <span 
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                        getStatusClass(transaction.status)
                      )}
                    >
                      {getStatusIcon(transaction.status)}
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;
