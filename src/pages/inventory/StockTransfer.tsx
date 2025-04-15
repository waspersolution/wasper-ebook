
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useStockTransfer } from '@/hooks/inventory/useStockTransfer';
// Remove incorrect useSupabase import

const StockTransfer = () => {
  const { toast } = useToast();
  const [sourceBranchId, setSourceBranchId] = useState('branch-1'); // In a real app, get from context
  const [branches, setBranches] = useState([
    { id: 'branch-1', name: 'Main Branch' },
    { id: 'branch-2', name: 'North Branch' },
    { id: 'branch-3', name: 'South Branch' },
  ]);
  const [targetBranchId, setTargetBranchId] = useState('');

  const {
    availableProducts,
    selectedProductId,
    setSelectedProductId,
    quantity,
    setQuantity,
    transferHistory,
    loading,
    handleTransfer
  } = useStockTransfer({ sourceBranchId, targetBranchId });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Stock Transfer</h1>
          <p className="text-muted-foreground">
            Transfer inventory items between branches
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Create Transfer</CardTitle>
            <CardDescription>Select product and destination branch</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Source Branch</label>
                <Select disabled value={sourceBranchId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Target Branch</label>
                <Select value={targetBranchId} onValueChange={setTargetBranchId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches
                      .filter(branch => branch.id !== sourceBranchId)
                      .map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Product</label>
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProducts.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} ({product.stock || product.stockQuantity || 0} in stock)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <Input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  min={1}
                />
              </div>
              
              <Button 
                onClick={handleTransfer}
                disabled={!selectedProductId || !targetBranchId || loading}
                className="w-full"
              >
                {loading ? "Processing..." : "Transfer Stock"}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Transfer History</CardTitle>
            <CardDescription>Recent stock movements</CardDescription>
          </CardHeader>
          <CardContent>
            {transferHistory.length > 0 ? (
              <div className="space-y-4">
                {transferHistory.map((transfer, index) => (
                  <div key={index} className="p-3 border rounded-md">
                    <div className="text-sm">
                      <span className="font-medium">From:</span> {branches.find(b => b.id === transfer.fromBranchId)?.name}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">To:</span> {branches.find(b => b.id === transfer.toBranchId)?.name}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Items:</span> {transfer.items.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(transfer.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No transfers yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StockTransfer;
