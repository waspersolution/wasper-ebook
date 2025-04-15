
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FixedSizeGrid } from 'react-window';
import { Search, Plus, Tag, Barcode, Clock, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Product } from './Types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QuantityInput from '@/components/branches/transfer/QuantityInput';

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  frequentItems?: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart, frequentItems = [] }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');
  const [barcodeScannerOpen, setBarcodeScannerOpen] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [windowWidth, setWindowWidth] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [quantityDialogOpen, setQuantityDialogOpen] = useState(false);

  // Get unique categories from products
  const categories = [...new Set(products.map(product => product.category))];

  const filteredProducts = products.filter(product => 
    (activeCategory === 'all' || product.category === activeCategory) &&
    (searchTerm === '' || 
     product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Update width when window resizes
  useEffect(() => {
    const updateWidth = () => {
      if (gridRef.current) {
        setWindowWidth(gridRef.current.offsetWidth);
      }
    };

    // Initial width
    updateWidth();

    // Add event listener
    window.addEventListener('resize', updateWidth);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Calculate grid dimensions
  const calculateGridDimensions = () => {
    // Default card width is ~250px, leaving some space for margins
    const cardWidth = 250;
    const columns = Math.max(1, Math.floor(windowWidth / cardWidth));
    return { columns, itemWidth: windowWidth / columns };
  };

  const { columns, itemWidth } = calculateGridDimensions();
  const itemHeight = 220; // Fixed height for each product card

  // Function to handle barcode input
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find(p => 
      p.barcode === manualBarcode || p.sku === manualBarcode
    );
    
    if (product) {
      onAddToCart(product);
      toast({
        title: 'Item found',
        description: `${product.name} added to cart.`,
      });
      setManualBarcode('');
      setBarcodeScannerOpen(false);
    } else {
      toast({
        title: 'Product not found',
        description: 'No product matched the scanned barcode.',
        variant: 'destructive',
      });
    }
  };

  // Handle opening quantity dialog
  const handleOpenQuantityDialog = (product: Product) => {
    setSelectedProductId(product.id);
    setQuantity(1); // Reset quantity to 1
    setQuantityDialogOpen(true);
  };

  // Handle adding multiple quantities
  const handleAddWithQuantity = () => {
    if (!selectedProductId) return;
    
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    // Check if quantity is valid
    if (quantity <= 0) {
      toast({
        title: 'Invalid Quantity',
        description: 'Please enter a quantity greater than zero.',
        variant: 'destructive',
      });
      return;
    }

    // Check if enough stock available
    if (quantity > product.stock) {
      toast({
        title: 'Insufficient Stock',
        description: `Only ${product.stock} units available.`,
        variant: 'destructive',
      });
      return;
    }

    // Add to cart multiple times
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }

    toast({
      title: 'Items Added',
      description: `${quantity} ${product.name} added to cart.`,
    });
    
    // Close dialog and reset
    setQuantityDialogOpen(false);
    setSelectedProductId(null);
    setQuantity(1);
  };

  // Cell renderer for virtual list
  const Cell = ({ columnIndex, rowIndex, style }: { columnIndex: number, rowIndex: number, style: React.CSSProperties }) => {
    const index = rowIndex * columns + columnIndex;
    if (index >= filteredProducts.length) return null;
    
    const product = filteredProducts[index];
    return (
      <div style={style} className="p-2">
        <Card className="h-full overflow-hidden">
          <div className="bg-muted p-4">
            <div className="h-24 flex items-center justify-center text-4xl font-bold text-muted-foreground">
              {product.name.charAt(0)}
            </div>
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium truncate">{product.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Tag className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground truncate">{product.category}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">SKU: {product.sku}</p>
                <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
                <p className="text-lg font-semibold mt-2">${product.price.toFixed(2)}</p>
              </div>
              <div className="flex flex-col gap-1">
                <Button 
                  size="sm" 
                  onClick={() => onAddToCart(product)}
                  disabled={product.stock <= 0}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenQuantityDialog(product)}
                  disabled={product.stock <= 0}
                >
                  #
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products by name or SKU..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          className="flex gap-2"
          onClick={() => setBarcodeScannerOpen(true)}
        >
          <Barcode className="h-4 w-4" />
          <span className="hidden sm:inline">Scan</span>
        </Button>
      </div>

      {/* Frequent Items Section */}
      {frequentItems.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium flex items-center mb-2">
            <Clock className="h-4 w-4 mr-1" />
            Frequently Purchased
          </h3>
          <ScrollArea className="w-full whitespace-nowrap pb-2">
            <div className="flex space-x-2">
              {frequentItems.map(product => (
                <Card key={product.id} className="w-40 flex-shrink-0">
                  <CardContent className="p-3">
                    <h4 className="font-medium text-sm truncate">{product.name}</h4>
                    <p className="text-sm font-semibold">${product.price.toFixed(2)}</p>
                    <div className="flex flex-col gap-1 mt-2">
                      <Button 
                        size="sm" 
                        className="w-full" 
                        onClick={() => onAddToCart(product)}
                        disabled={product.stock <= 0}
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => handleOpenQuantityDialog(product)}
                        disabled={product.stock <= 0}
                      >
                        <span className="text-xs mr-1">Qty</span> #
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full flex overflow-x-auto">
          <TabsTrigger
            value="all" 
            onClick={() => setActiveCategory('all')}
            className="flex-shrink-0"
          >
            All Products
          </TabsTrigger>
          {categories.map(category => (
            <TabsTrigger
              key={category}
              value={category}
              onClick={() => setActiveCategory(category)}
              className="flex-shrink-0"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="mt-4" ref={gridRef}>
          {windowWidth > 0 && filteredProducts.length > 0 ? (
            <FixedSizeGrid
              columnCount={columns}
              columnWidth={itemWidth}
              height={Math.min(600, Math.ceil(filteredProducts.length / columns) * itemHeight)}
              rowCount={Math.ceil(filteredProducts.length / columns)}
              rowHeight={itemHeight}
              width={windowWidth}
            >
              {Cell}
            </FixedSizeGrid>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No products found.</p>
            </div>
          )}
        </div>
      </Tabs>

      {/* Barcode Scanner Dialog */}
      <Dialog open={barcodeScannerOpen} onOpenChange={setBarcodeScannerOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan Barcode</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleBarcodeSubmit} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input 
                autoFocus
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                placeholder="Enter barcode or SKU"
              />
              <Button type="submit">Search</Button>
            </div>
            <div className="border border-dashed rounded-md p-8 flex items-center justify-center">
              <div className="text-center">
                <Barcode className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Position barcode in front of camera or enter manually
                </p>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Quantity Dialog */}
      <Dialog open={quantityDialogOpen} onOpenChange={setQuantityDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter Quantity</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedProductId && (
              <div>
                <p className="text-sm font-medium mb-1">
                  {products.find(p => p.id === selectedProductId)?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Available: {products.find(p => p.id === selectedProductId)?.stock}
                </p>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="text-center"
                min={1}
                max={selectedProductId ? products.find(p => p.id === selectedProductId)?.stock : 1}
              />
              <Button 
                variant="outline"
                size="sm"
                onClick={() => {
                  const product = products.find(p => p.id === selectedProductId);
                  if (product) {
                    setQuantity(prev => Math.min(product.stock, prev + 1));
                  }
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setQuantityDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddWithQuantity}>
                Add to Cart
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductList;
