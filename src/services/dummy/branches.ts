
import { Branch } from '../types';

export const dummyBranches: Branch[] = [
  {
    id: "branch-001",
    companyId: "comp-001",
    name: "TechRetail - Indiranagar",
    address: "100 CMH Road, Indiranagar, Bangalore",
    phone: "+91 9876543213",
    email: "indiranagar@techretail.com",
    is_main_branch: true,
    manager: "Rahul Sharma",
    status: "active"
  },
  {
    id: "branch-002",
    companyId: "comp-001",
    name: "TechRetail - Koramangala",
    address: "80 Feet Road, Koramangala, Bangalore",
    phone: "+91 9876543214",
    email: "koramangala@techretail.com",
    is_main_branch: false,
    manager: "Priya Patel",
    status: "active"
  },
  {
    id: "branch-003",
    companyId: "comp-002",
    name: "Metro Merchandise - Andheri",
    address: "Andheri East, Mumbai",
    phone: "+91 9876543215",
    email: "andheri@metromerchandise.com",
    is_main_branch: true,
    manager: "Vikram Singh",
    status: "active"
  }
];
