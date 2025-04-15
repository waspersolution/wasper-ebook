
export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  poNumber: string;
  poDate: string;
  status: 'Draft' | 'Processing' | 'Received' | 'Cancelled';
  items: PurchaseOrderItem[];
  total: number;
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export interface PurchaseOrderItem {
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  receivedQuantity?: number;
  notes?: string;
}

export interface PurchaseOrderDetail extends PurchaseOrder {
  supplier: {
    id: string;
    name: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  timeline: {
    date: string;
    status: string;
    user: string;
    notes?: string;
  }[];
}
