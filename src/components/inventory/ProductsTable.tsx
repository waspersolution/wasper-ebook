
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Product } from '@/types/inventory';

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b text-xs text-muted-foreground">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Code</th>
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-right">Price</th>
            <th className="px-4 py-2 text-right">Quantity</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b">
              <td className="px-4 py-3 font-medium">{product.name}</td>
              <td className="px-4 py-3">{product.code || product.sku}</td>
              <td className="px-4 py-3">{product.itemGroupId || product.category}</td>
              <td className="px-4 py-3 text-right">${product.price.toFixed(2)}</td>
              <td className="px-4 py-3 text-right">
                <span className={`${(product.stockQuantity || product.stock) < 5 ? 'text-red-500' : ''}`}>
                  {product.stockQuantity || product.stock}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex justify-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onEdit(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500"
                    onClick={() => onDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
