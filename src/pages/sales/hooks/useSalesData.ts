
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Customer, Product, PaymentMethod, CartItem } from '../components/Types';
import { getFrequentItems } from '../utils/salesCalculations';

// Mock data if Supabase connection fails
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

export function useSalesData() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [branchData, setBranchData] = useState<any | null>(null);
  const [loadingBranchData, setLoadingBranchData] = useState(true);
  const [frequentItems, setFrequentItems] = useState<Product[]>([]);
  const [loadingFrequentItems, setLoadingFrequentItems] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        console.log("Fetching products from Supabase...");
        // Try to fetch products from Supabase
        const { data: productsData, error: productsError } = await supabase
          .from('items')
          .select(`
            id, 
            name, 
            price,
            stock_quantity,
            code,
            description,
            item_group_id,
            item_groups(id, name)
          `);
        
        if (productsError) {
          console.warn("Error fetching from Supabase, using mock data:", productsError.message);
          setProducts(mockProducts);
        } else if (productsData && productsData.length > 0) {
          console.log("Supabase returned products:", productsData.length);
          const formattedProducts = productsData.map(p => ({
            id: p.id,
            name: p.name,
            price: Number(p.price),
            stock: p.stock_quantity || 0,
            sku: p.code,
            barcode: p.code, // Using code as barcode for now
            description: p.description,
            image_url: '',
            category: p.item_groups?.name || 'Uncategorized'
          }));
          
          setProducts(formattedProducts);
        } else {
          console.log("No products found in Supabase, using mock data");
          setProducts(mockProducts);
        }
        
        // Fetch customers (accounts)
        const { data: accountsData, error: accountsError } = await supabase
          .from('accounts')
          .select('*');
        
        if (accountsError) {
          console.warn("Error fetching accounts:", accountsError.message);
          setCustomers([
            { id: 'cust1', name: 'John Smith', email: 'john@example.com', phone: '555-123-4567', credit_limit: 1000, outstanding_balance: 0 },
            { id: 'cust2', name: 'Jane Doe', email: 'jane@example.com', phone: '555-987-6543', credit_limit: 2000, outstanding_balance: 450 }
          ]);
        } else if (accountsData && accountsData.length > 0) {
          const customersData: Customer[] = accountsData.map(account => ({
            id: account.id,
            name: account.name,
            email: account.email,
            phone: account.phone,
            address: account.address,
            credit_limit: 1000, // Default value as it doesn't exist in accounts
            outstanding_balance: 0 // Default value as it doesn't exist in accounts
          }));
          
          setCustomers(customersData);
        } else {
          setCustomers([
            { id: 'cust1', name: 'John Smith', email: 'john@example.com', phone: '555-123-4567', credit_limit: 1000, outstanding_balance: 0 },
            { id: 'cust2', name: 'Jane Doe', email: 'jane@example.com', phone: '555-987-6543', credit_limit: 2000, outstanding_balance: 450 }
          ]);
        }
        
        // Use hardcoded payment methods since the table doesn't exist yet
        const paymentMethodsData: PaymentMethod[] = [
          { id: '1', name: 'Cash', code: 'cash' },
          { id: '2', name: 'Credit Card', code: 'credit_card' },
          { id: '3', name: 'Mobile Payment', code: 'mobile_payment' },
          { id: '4', name: 'POS Terminal', code: 'pos_terminal' },
          { id: '5', name: 'Credit Account', code: 'credit_account' }
        ];
        
        setPaymentMethods(paymentMethodsData);

      } catch (error: any) {
        console.error("Error fetching initial data:", error);
        // Use mock data as fallback
        setProducts(mockProducts);
        setCustomers([
          { id: 'cust1', name: 'John Smith', email: 'john@example.com', phone: '555-123-4567', credit_limit: 1000, outstanding_balance: 0 },
          { id: 'cust2', name: 'Jane Doe', email: 'jane@example.com', phone: '555-987-6543', credit_limit: 2000, outstanding_balance: 450 }
        ]);
        
        toast({
          title: 'Data Loading Error',
          description: error.message || 'Failed to load data. Using demo data instead.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [toast]);

  // Fetch frequent items from sales history or set defaults if not available
  useEffect(() => {
    const fetchFrequentItems = async () => {
      setLoadingFrequentItems(true);
      try {
        // If products are loaded, use a subset for frequent items
        if (products.length > 0) {
          // Try to get real sale items from the database
          const { data: saleItemsData, error: saleItemsError } = await supabase
            .from('sale_items')
            .select(`
              item_id,
              quantity,
              unit_price,
              sales!inner(created_at)
            `)
            .order('created_at', { foreignTable: 'sales', ascending: false })
            .limit(100);
          
          if (saleItemsError || !saleItemsData || saleItemsData.length === 0) {
            // Use a subset of products as frequent items if no sale data
            const frequent = products.slice(0, Math.min(3, products.length));
            setFrequentItems(frequent);
          } else {
            // Convert to CartItem format
            const historicalItems: CartItem[] = saleItemsData
              .map(item => {
                const product = products.find(p => p.id === item.item_id);
                if (!product) return null;
                
                return {
                  id: product.id,
                  name: product.name,
                  price: Number(item.unit_price),
                  quantity: item.quantity,
                  stock: product.stock,
                  sku: product.sku
                };
              })
              .filter(Boolean) as CartItem[];
            
            // Get frequent items
            const frequent = getFrequentItems(historicalItems);
            
            // Map back to full Product objects
            const frequentProducts = frequent
              .map(item => products.find(p => p.id === item.id))
              .filter(Boolean) as Product[];
            
            setFrequentItems(frequentProducts.length > 0 ? frequentProducts : products.slice(0, 3));
          }
        } else {
          // No products loaded yet
          setFrequentItems([]);
        }
      } catch (error: any) {
        console.error("Error fetching frequent items:", error);
        // Set some default frequent items
        setFrequentItems(products.slice(0, Math.min(3, products.length)));
      } finally {
        setLoadingFrequentItems(false);
      }
    };
    
    // Only fetch frequent items when products are loaded
    if (products.length > 0) {
      fetchFrequentItems();
    }
  }, [products]);

  // Check for user's active branch
  useEffect(() => {
    const fetchUserBranch = async () => {
      setLoadingBranchData(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("User not authenticated");
        }

        // Instead of using .single() which requires exactly one row,
        // use regular select and handle the case of no data gracefully
        const { data, error } = await supabase
          .from('user_branches')
          .select('branch_id, branches:branch_id(id, name, address, phone, email)')
          .eq('user_id', user.id);

        if (error) throw error;
        
        // If we have data, use the first branch. Otherwise, use a default branch
        if (data && data.length > 0) {
          setBranchData(data[0]);
        } else {
          // Set a default branch data for when user doesn't have a specific branch assigned
          setBranchData({
            branches: {
              name: 'Default Branch',
              address: '123 Main Street',
              phone: '555-123-4567',
              email: 'info@wasper.com'
            }
          });
          
          // Log a warning but don't show error toast to user
          console.warn("No branch assigned to user, using default branch");
        }
      } catch (error: any) {
        console.error("Error fetching user branch:", error);
        // Don't show an error toast anymore since we're handling the no-data case
        // Just set a default branch instead
        setBranchData({
          branches: {
            name: 'Default Branch',
            address: '123 Main Street',
            phone: '555-123-4567',
            email: 'info@wasper.com'
          }
        });
      } finally {
        setLoadingBranchData(false);
      }
    };

    fetchUserBranch();
  }, [toast]);

  return { 
    products, 
    customers, 
    paymentMethods,
    loading,
    branchData,
    loadingBranchData,
    frequentItems,
    loadingFrequentItems
  };
}
