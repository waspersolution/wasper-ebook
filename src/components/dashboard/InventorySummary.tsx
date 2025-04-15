import React, { useEffect, useState } from 'react';
import { InventoryItem } from '@/services/types';
import { ArrowUpRight, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface InventorySummaryProps {
  branchId: string;
  className?: string;
}

const sampleInventoryItems: InventoryItem[] = [
  {
    id: '1',
    productId: 'P001',
    productName: 'Smartphone X',
    quantity: 45,
    companyId: 'company-1',
    branchId: 'branch-1',
    location: 'Shelf A1',
    stockLevel: 'normal'
  },
  {
    id: '2',
    productId: 'P002',
    productName: 'Laptop Pro',
    quantity: 12,
    companyId: 'company-1',
    branchId: 'branch-1',
    location: 'Shelf B3',
    stockLevel: 'normal'
  },
  {
    id: '3',
    productId: 'P003',
    productName: 'Wireless Earbuds',
    quantity: 5,
    companyId: 'company-1',
    branchId: 'branch-1',
    location: 'Drawer C2',
    stockLevel: 'low'
  },
  {
    id: '4',
    productId: 'P004',
    productName: 'Smart Watch',
    quantity: 0,
    companyId: 'company-1',
    branchId: 'branch-1',
    location: 'Display D1',
    stockLevel: 'out_of_stock'
  }
];

const InventorySummary: React.FC<InventorySummaryProps> = ({ branchId, className }) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInventoryItems = async () => {
      console.log(`Fetching inventory for branch ID: ${branchId}`);
      
      try {
        setItems(sampleInventoryItems);
      } catch (error: any) {
        console.error("Error fetching inventory items:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load inventory items",
          variant: "destructive"
        });
      }
    };
    
    fetchInventoryItems();
  }, [branchId, toast]);
  
  const getStockStatusClass = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-success-50 text-success-700';
      case 'low':
        return 'bg-warning-50 text-warning-700';
      case 'out_of_stock':
        return 'bg-danger-50 text-danger-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getStockLabel = (status: string) => {
    switch (status) {
      case 'normal':
        return 'Normal';
      case 'low':
        return 'Low';
      case 'out_of_stock':
        return 'Out of Stock';
      default:
        return status;
    }
  };

  return (
    <div className={cn("wasper-card p-6", className)}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Inventory Summary</h2>
        <a href="/inventory/stock" className="text-sm font-medium text-primary flex items-center">
          View All <ArrowUpRight size={14} className="ml-1" />
        </a>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Product</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Quantity</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Location</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-border hover:bg-muted/50">
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-muted rounded-md">
                      <Package size={16} className="text-muted-foreground" />
                    </div>
                    <span>{item.productName}</span>
                  </div>
                </td>
                <td className="py-3 px-2">{item.quantity}</td>
                <td className="py-3 px-2">{item.location || 'N/A'}</td>
                <td className="py-3 px-2">
                  <span
                    className={cn(
                      "inline-block px-2 py-1 rounded text-xs font-medium",
                      getStockStatusClass(item.stockLevel)
                    )}
                  >
                    {getStockLabel(item.stockLevel)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventorySummary;
