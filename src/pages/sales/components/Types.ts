
// Shared types for the POS system
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  sku: string;
}

export interface Payment {
  method: 'cash' | 'credit_card' | 'mobile_payment' | 'pos_terminal' | 'credit_account';
  amount: number;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  credit_limit?: number;
  outstanding_balance?: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  sku: string;
  stock: number;
  barcode?: string;
  description?: string;
  image_url?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
}

export interface Invoice {
  invoiceNumber: string;
  date: string;
}

export interface BranchData {
  branches?: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
}

export interface PaymentMethod {
  id: string;
  name: string;
  code: string;
}

export interface SaleData {
  invoice_number: string;
  customer_id: string | null;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  payment_method: string; // Default payment method
  items: {
    product_id: string;
    quantity: number;
    unit_price: number;
    tax_rate: number;
    tax_amount: number;
    total_amount: number;
  }[];
  payments: {
    payment_method_id: string;
    amount: number;
  }[];
}
