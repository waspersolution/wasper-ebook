
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBranchTransfer } from '@/hooks/branch/useBranchTransfer';
import ProductSelect from './transfer/ProductSelect';
import QuantityInput from './transfer/QuantityInput';
import TransferVisualization from './transfer/TransferVisualization';
import { Branch } from '@/services/types';

interface BranchTransferProps {
  companyId: string;
  sourceBranchId: string;
  targetBranchId: string | null;
  onTransferComplete?: () => void;
  branches?: Branch[]; // Optional list of branches for visualization
}

const BranchTransfer: React.FC<BranchTransferProps> = ({ 
  sourceBranchId, 
  targetBranchId,
  onTransferComplete,
  branches = []
}) => {
  const {
    products,
    loading,
    transferLoading,
    selectedProduct,
    setSelectedProduct,
    quantity,
    setQuantity,
    handleTransfer
  } = useBranchTransfer({ 
    sourceBranchId, 
    onTransferComplete 
  });

  // Find branch objects for visualization
  const sourceBranch = branches.find(branch => branch.id === sourceBranchId) || null;
  const targetBranch = targetBranchId ? branches.find(branch => branch.id === targetBranchId) || null : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Stock</CardTitle>
        <CardDescription>Move inventory between branches</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProductSelect 
          products={products}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          loading={loading}
        />

        <QuantityInput 
          quantity={quantity}
          setQuantity={setQuantity}
          disabled={!selectedProduct}
        />

        <TransferVisualization 
          sourceBranch={sourceBranch}
          targetBranch={targetBranch}
        />
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => targetBranchId && handleTransfer(targetBranchId)} 
          disabled={!selectedProduct || !targetBranchId || quantity <= 0 || transferLoading}
          className="w-full"
        >
          {transferLoading ? "Transferring..." : "Transfer Stock"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BranchTransfer;
