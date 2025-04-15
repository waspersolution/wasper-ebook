
import React from 'react';
import { ShoppingBag, Users, AlertCircle, Package } from 'lucide-react';
import StatCard from './StatCard';
import GrowthIndicator from './GrowthIndicator';
import { useStats } from '@/hooks/useStats';
import { formatCurrency } from '@/utils/formatting';

interface DashboardStatsProps {
  branchId: string;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ branchId }) => {
  const { stats, loading } = useStats(branchId);
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 rounded-lg border bg-card p-6 animate-pulse">
            <div className="bg-muted h-4 w-1/3 mb-4 rounded"></div>
            <div className="bg-muted h-6 w-1/2 rounded"></div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Total Sales */}
      <StatCard
        title="Total Sales"
        value={formatCurrency(stats.totalSales)}
        icon={ShoppingBag}
        footer={<GrowthIndicator value={stats.salesGrowth} />}
      />

      {/* Total Orders */}
      <StatCard
        title="Total Orders"
        value={stats.totalOrders}
        icon={ShoppingBag}
        iconColor="text-wasper-700"
        iconBgColor="bg-wasper-100"
        footer={<span className="text-muted-foreground">{stats.pendingOrders} pending orders</span>}
      />

      {/* Total Customers */}
      <StatCard
        title="Customers"
        value={stats.totalCustomers}
        icon={Users}
        iconColor="text-warning-700"
        iconBgColor="bg-warning-100"
        footer={<span className="text-muted-foreground">Active this month</span>}
      />

      {/* Low Stock Items */}
      <StatCard
        title="Low Stock Items"
        value={stats.lowStockItems}
        icon={AlertCircle}
        iconColor="text-danger-600"
        iconBgColor="bg-danger-100"
        footer={<span className="text-danger-600">Requires attention</span>}
      />
    </div>
  );
};

export default DashboardStats;
