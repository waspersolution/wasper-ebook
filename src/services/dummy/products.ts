
import { Product } from '../types';

export const dummyProducts: Product[] = [
  {
    id: "prod-001",
    name: "Laptop Pro 15",
    sku: "LP15-001",
    barcode: "8901234567890",
    category: "Electronics",
    price: 75000,
    costPrice: 62000,
    stock: 25,
    companyId: "comp-001",
    branchId: "branch-001",
    taxRate: 18
  },
  {
    id: "prod-002",
    name: "Smartphone X12",
    sku: "SPX12-002",
    barcode: "8901234567891",
    category: "Electronics",
    price: 45000,
    costPrice: 38000,
    stock: 40,
    companyId: "comp-001",
    branchId: "branch-001",
    taxRate: 18
  },
  {
    id: "prod-003",
    name: "Wireless Earbuds",
    sku: "WEB-003",
    barcode: "8901234567892",
    category: "Electronics",
    price: 8000,
    costPrice: 5500,
    stock: 5,
    companyId: "comp-001",
    branchId: "branch-002",
    taxRate: 18
  }
];
