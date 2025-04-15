
import { User } from '../types';

export const dummyUsers: User[] = [
  {
    id: "user-001",
    name: "Admin User",
    email: "admin@wasper.com",
    role: "Super Admin",
    lastActive: "2023-04-10T09:30:00",
    status: "active"
  },
  {
    id: "user-002",
    name: "Rahul Sharma",
    email: "rahul@techretail.com",
    role: "Branch Manager",
    companyId: "comp-001",
    branchId: "branch-001",
    lastActive: "2023-04-09T16:45:00",
    status: "active"
  },
  {
    id: "user-003",
    name: "Priya Patel",
    email: "priya@techretail.com",
    role: "Branch Manager",
    companyId: "comp-001",
    branchId: "branch-002",
    lastActive: "2023-04-10T11:20:00",
    status: "active"
  }
];
