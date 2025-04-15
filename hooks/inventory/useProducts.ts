
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/inventory';

// Mock data for products
const mockProducts: Product[] = [
  { 
    id: '1', 
    name: 'Samsung Galaxy S23', 
    sku: 'PHONE-SAM-S23',
    price: 799.99, 
    stock: 50,
    category: 'Smartphones',
    barcode: 'BSGS23001'
  },
  { 
    id: '2', 
    name: 'iPhone 15 Pro', 
    sku: 'PHONE-APP-15P',
    price: 999.99, 
    stock: 30,
    category: 'Smartphones',
    barcode: 'BIPH15P002'
  },
  { 
    id: '3', 
    name: 'Dell XPS 15', 
    sku: 'LAPT-DEL-XPS15',
    price: 1499.99, 
    stock: 20,
    category: 'Laptops',
    barcode: 'BDXPS15003'
  },
  { 
    id: '4', 
    name: 'MacBook Pro 16"', 
    sku: 'LAPT-APP-MBP16',
    price: 2199.99, 
    stock: 15,
    category: 'Laptops',
    barcode: 'BMBP16004'
  },
  { 
    id: '5', 
    name: 'Sony WH-1000XM5', 
    sku: 'HEAD-SON-XM5',
    price: 349.99, 
    stock: 40,
    category: 'Audio',
    barcode: 'BSWH1X5005'
  }
];

export const useProducts = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock API call - would be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter products based on search term
      const filteredProducts = mockProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setProducts(filteredProducts);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch products');
      setError(error);
      toast({
        title: 'Error',
        description: 'Failed to load products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch whenever search term changes
  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  const addProduct = (product: Partial<Product>) => {
    // Generate an ID if one is not provided
    const newProduct: Product = {
      id: product.id || crypto.randomUUID(),
      name: product.name || '',
      sku: product.sku || '',
      price: product.price || 0,
      stock: product.stock || 0,
      category: product.category || '',
      description: product.description,
      barcode: product.barcode || '',
      image_url: product.image_url,
      code: product.code,
      itemGroupId: product.itemGroupId,
      stockQuantity: product.stockQuantity,
    };
    
    setProducts(prev => [...prev, newProduct]);
    toast({
      title: 'Product Added',
      description: `${newProduct.name} has been added to inventory.`
    });
    
    return newProduct;
  };

  const updateProduct = (updatedProduct: Partial<Product>) => {
    if (!updatedProduct.id) {
      console.error('Cannot update product without an ID');
      return;
    }
    
    setProducts(prev => 
      prev.map(product => product.id === updatedProduct.id ? { ...product, ...updatedProduct } : product)
    );
    
    toast({
      title: 'Product Updated',
      description: `${updatedProduct.name || 'Product'} has been updated.`
    });
  };

  const deleteProduct = (id: string) => {
    const productToDelete = products.find(product => product.id === id);
    setProducts(prev => prev.filter(product => product.id !== id));
    toast({
      title: 'Product Deleted',
      description: productToDelete ? `${productToDelete.name} has been deleted.` : 'Product has been deleted.'
    });
  };

  // Update stock quantity
  const updateStock = (id: string, newStock: number) => {
    setProducts(prev => 
      prev.map(product => {
        if (product.id === id) {
          return { ...product, stock: newStock };
        }
        return product;
      })
    );
  };
  
  const handleAddOrUpdate = (product: Partial<Product>) => {
    if (product.id && products.some(p => p.id === product.id)) {
      updateProduct(product);
    } else {
      addProduct(product);
    }
  };
  
  const handleDelete = (id: string) => {
    deleteProduct(id);
  };

  return {
    products,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    handleAddOrUpdate,
    handleDelete
  };
};
