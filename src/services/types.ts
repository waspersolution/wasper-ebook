
export interface Company {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  gstin?: string;
  createdAt: string;
  status: "active" | "inactive";
}

export interface Branch {
  id: string;
  companyId: string;
  name: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  is_main_branch?: boolean | null;
  manager?: string;
  status?: "active" | "inactive";
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  companyId?: string;
  branchId?: string;
  lastActive: string;
  status: "active" | "inactive";
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  companyId: string;
  branchId?: string;
  taxRate: number;
}

export interface SaleTransaction {
  id: string;
  date: string;
  customerId: string;
  customerName: string;
  total: number;
  status: "completed" | "pending" | "cancelled";
  paymentMethod: string;
  companyId: string;
  branchId: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  companyId: string;
  branchId: string;
  location?: string;
  stockLevel: "normal" | "low" | "out_of_stock";
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  salesGrowth: number;
  pendingOrders: number;
  lowStockItems: number;
}
