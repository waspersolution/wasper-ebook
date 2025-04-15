
export interface ItemGroup {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
  website?: string;
  notes?: string;
  code?: string;
  supplierGroupId?: string;
  branchId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
  barcode?: string;
  image_url?: string;
  code?: string;
  itemGroupId?: string;
  stockQuantity?: number;
}

export interface BranchInventory {
  branchId: string;
  branchName: string;
  items: {
    itemId: string;
    quantity: number;
    location?: string;
  }[];
}

export interface StockTransfer {
  id: string;
  fromBranchId: string;
  toBranchId: string;
  items: {
    itemId: string;
    quantity: number;
  }[];
  status: 'Draft' | 'Pending' | 'Completed' | 'Cancelled';
  createdAt: string;
  createdBy: string;
  notes?: string;
}

export interface SupplierGroup {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Item {
  id: string;
  name: string;
  code: string;
  price: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  stock_quantity?: number;
}
