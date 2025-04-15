
import { InventoryItem } from '../types';

export const dummyInventoryItems: InventoryItem[] = [
  {
    id: "inv-001",
    productId: "prod-001",
    productName: "Laptop Pro 15",
    quantity: 25,
    companyId: "comp-001",
    branchId: "branch-001",
    location: "Rack A1",
    stockLevel: "normal"
  },
  {
    id: "inv-002",
    productId: "prod-002",
    productName: "Smartphone X12",
    quantity: 40,
    companyId: "comp-001",
    branchId: "branch-001",
    location: "Rack B2",
    stockLevel: "normal"
  },
  {
    id: "inv-003",
    productId: "prod-003",
    productName: "Wireless Earbuds",
    quantity: 5,
    companyId: "comp-001",
    branchId: "branch-002",
    location: "Rack C3",
    stockLevel: "low"
  }
];
