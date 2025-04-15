
import { CartItem, Payment } from '../components/Types';

export const calculateSubtotal = (cart: CartItem[]) => {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

export const calculateTax = (cart: CartItem[], taxRate: number = 0.1) => {
  // Assuming a 10% tax rate by default
  return calculateSubtotal(cart) * taxRate;
};

export const calculateTotal = (cart: CartItem[]) => {
  return calculateSubtotal(cart) + calculateTax(cart);
};

export const totalPaid = (payments: Payment[]) => {
  return payments.reduce((sum, payment) => sum + payment.amount, 0);
};

export const remainingAmount = (cart: CartItem[], payments: Payment[]) => {
  return calculateTotal(cart) - totalPaid(payments);
};

// New function to track frequently purchased items
export const getFrequentItems = (historicalItems: CartItem[], limit: number = 6) => {
  // Create a frequency map
  const frequencyMap = new Map<string, { count: number; item: CartItem }>();
  
  // Count occurrences of each product
  historicalItems.forEach(item => {
    const existingItem = frequencyMap.get(item.id);
    if (existingItem) {
      existingItem.count += item.quantity;
    } else {
      frequencyMap.set(item.id, { count: item.quantity, item });
    }
  });
  
  // Convert to array and sort by frequency
  return Array.from(frequencyMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map(entry => entry.item);
};
