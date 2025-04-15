
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CartItem, Product, Customer, Payment } from '../components/Types';

export function useCart() {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const inventoryCheck = (product: Product, quantity: number = 1): boolean => {
    return product.stock >= quantity;
  };

  const addToCart = (product: Product) => {
    if (!inventoryCheck(product)) {
      toast({
        title: 'Inventory Error',
        description: `${product.name} is out of stock.`,
        variant: 'destructive',
      });
      return;
    }
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        // Check if we can add more of this item
        if (!inventoryCheck(product, existingItem.quantity + 1)) {
          toast({
            title: 'Inventory Error',
            description: `Cannot add more ${product.name}, insufficient stock.`,
            variant: 'destructive',
          });
          return prevCart;
        }
        
        // Increment quantity if item already in cart
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Add new item to cart
        return [...prevCart, { 
          id: product.id, 
          name: product.name, 
          price: product.price, 
          quantity: 1,
          stock: product.stock,
          sku: product.sku
        }];
      }
    });
    
    toast({
      title: 'Item added',
      description: `${product.name} added to cart.`,
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
    toast({
      description: 'Item removed from cart',
    });
  };

  const updateQuantity = (id: string, quantity: number, products: Product[]) => {
    if (quantity < 1) return;
    
    setCart(prevCart => {
      const updatedCart = prevCart.map(item => {
        if (item.id === id) {
          // Find the corresponding product to check inventory
          const product = products.find(p => p.id === id);
          if (product && quantity > product.stock) {
            toast({
              title: 'Inventory Error',
              description: `Cannot add ${quantity} of ${item.name}, only ${product.stock} available.`,
              variant: 'destructive',
            });
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      });
      return updatedCart;
    });
  };

  const addPayment = (currentPaymentMethod: Payment['method'], currentPaymentAmount: number, remainingAmount: number) => {
    if (currentPaymentAmount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid payment amount.',
        variant: 'destructive',
      });
      return false;
    }
    
    if (currentPaymentMethod === 'credit_account' && !selectedCustomer) {
      toast({
        title: 'Customer Required',
        description: 'Please select a customer for credit account payment.',
        variant: 'destructive',
      });
      return false;
    }
    
    // Credit limit check for credit account payments
    if (currentPaymentMethod === 'credit_account' && selectedCustomer) {
      const potentialNewBalance = (selectedCustomer.outstanding_balance || 0) + currentPaymentAmount;
      if (potentialNewBalance > (selectedCustomer.credit_limit || 0)) {
        toast({
          title: 'Credit Limit Exceeded',
          description: `This payment would exceed ${selectedCustomer.name}'s credit limit.`,
          variant: 'destructive',
        });
        return false;
      }
    }
    
    const newPayment: Payment = {
      method: currentPaymentMethod,
      amount: currentPaymentAmount
    };
    
    setPayments([...payments, newPayment]);
    
    toast({
      title: 'Payment Added',
      description: `${currentPaymentAmount.toFixed(2)} added as ${currentPaymentMethod.replace('_', ' ')}.`,
    });
    return true;
  };
  
  const removePayment = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index));
    toast({
      description: 'Payment method removed',
    });
  };

  const clearCart = () => {
    setCart([]);
    setPayments([]);
    setSelectedCustomer(null);
  };

  const selectCustomer = (customerId: string, customers: Customer[]) => {
    const customer = customers.find(c => c.id === customerId);
    setSelectedCustomer(customer || null);
  };

  return {
    cart,
    payments,
    selectedCustomer,
    addToCart,
    removeFromCart,
    updateQuantity,
    addPayment,
    removePayment,
    clearCart,
    selectCustomer,
    setSelectedCustomer,
    setPayments
  };
}
