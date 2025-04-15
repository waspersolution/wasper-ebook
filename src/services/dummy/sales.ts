
import { SaleTransaction } from '../types';

export const dummySaleTransactions: SaleTransaction[] = [
  {
    id: "sale-001",
    date: "2023-04-10T11:30:00",
    customerId: "cust-001",
    customerName: "Anil Kumar",
    total: 79000,
    status: "completed",
    paymentMethod: "Credit Card",
    companyId: "comp-001",
    branchId: "branch-001"
  },
  {
    id: "sale-002",
    date: "2023-04-10T14:15:00",
    customerId: "cust-002",
    customerName: "Sunita Verma",
    total: 45000,
    status: "completed",
    paymentMethod: "UPI",
    companyId: "comp-001",
    branchId: "branch-001"
  },
  {
    id: "sale-003",
    date: "2023-04-10T16:45:00",
    customerId: "cust-003",
    customerName: "Rajesh Gupta",
    total: 8000,
    status: "pending",
    paymentMethod: "Cash",
    companyId: "comp-001",
    branchId: "branch-002"
  },
  {
    id: "sale-004",
    date: "2023-04-09T10:20:00",
    customerId: "cust-004",
    customerName: "Nisha Shah",
    total: 45000,
    status: "completed",
    paymentMethod: "Credit Card",
    companyId: "comp-001",
    branchId: "branch-002"
  },
  {
    id: "sale-005",
    date: "2023-04-09T15:50:00",
    customerId: "cust-005",
    customerName: "Vijay Reddy",
    total: 83000,
    status: "completed",
    paymentMethod: "UPI",
    companyId: "comp-001", 
    branchId: "branch-001"
  }
];
