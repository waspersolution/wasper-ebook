import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Index from "./pages/Index";
import Companies from "./pages/Companies";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import SuperAdminDashboard from "./pages/admin/SuperAdminDashboard";
import CompanyAdminDashboard from "./pages/admin/CompanyAdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCompanies from "./pages/admin/AdminCompanies";
import AdminSettings from "./pages/admin/AdminSettings";
import CompanyUsers from "./pages/company/CompanyUsers";
import CompanySales from "./pages/company/CompanySales";
import CompanyInventory from "./pages/company/CompanyInventory";
import CompanyBackup from "./pages/company/CompanyBackup";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import CompanyCreate from "./pages/admin/CompanyCreate";
import UserManagement from "./pages/master/UserManagement";
import BranchManagement from "./pages/master/BranchManagement";
import RoleManagement from "./pages/master/RoleManagement";
import LedgerManagement from "./pages/master/LedgerManagement";
import SalesOrders from "./pages/sales/SalesOrders";
import SalesInvoices from "./pages/sales/SalesInvoices";
import SalesPOS from "./pages/sales/SalesPOS";
import PurchaseOrders from "./pages/purchase/PurchaseOrders";
import PurchaseOrderDetail from "./pages/purchase/PurchaseOrderDetail";
import PurchaseBills from "./pages/purchase/PurchaseBills";
import InventoryProducts from "./pages/inventory/InventoryProducts";
import InventoryStock from "./pages/inventory/InventoryStock";
import ItemGroups from "./pages/inventory/ItemGroups";
import Suppliers from "./pages/inventory/Suppliers";
import SupplierGroups from "./pages/inventory/SupplierGroups";
import AccountingJournal from "./pages/accounting/AccountingJournal";
import AccountingLedger from "./pages/accounting/AccountingLedger";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import StockTransfer from './pages/inventory/StockTransfer';

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Super Admin Routes */}
              <Route path="/admin" element={<SuperAdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/companies" element={<AdminCompanies />} />
              <Route path="/admin/companies/create" element={<CompanyCreate />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              
              {/* Company Admin Routes */}
              <Route path="/company/:companyId" element={<CompanyAdminDashboard />} />
              <Route path="/company/:companyId/dashboard" element={<CompanyDashboard />} />
              <Route path="/company/:companyId/users" element={<CompanyUsers />} />
              <Route path="/company/:companyId/sales" element={<CompanySales />} />
              <Route path="/company/:companyId/inventory" element={<CompanyInventory />} />
              <Route path="/company/:companyId/backup" element={<CompanyBackup />} />
              
              {/* Master Data Routes */}
              <Route path="/users" element={<UserManagement />} />
              <Route path="/roles" element={<RoleManagement />} />
              <Route path="/branches" element={<BranchManagement />} />
              <Route path="/ledgers" element={<LedgerManagement />} />
              
              {/* Sales Routes */}
              <Route path="/sales/orders" element={<SalesOrders />} />
              <Route path="/sales/invoices" element={<SalesInvoices />} />
              <Route path="/sales/pos" element={<SalesPOS />} />
              
              {/* Purchase Routes */}
              <Route path="/purchase/orders" element={<PurchaseOrders />} />
              <Route path="/purchase/orders/:id" element={<PurchaseOrderDetail />} />
              <Route path="/purchase/bills" element={<PurchaseBills />} />
              
              {/* Inventory Routes */}
              <Route path="/inventory/products" element={<InventoryProducts />} />
              <Route path="/inventory/stock" element={<InventoryStock />} />
              <Route path="/inventory/item-groups" element={<ItemGroups />} />
              <Route path="/inventory/suppliers" element={<Suppliers />} />
              <Route path="/inventory/supplier-groups" element={<SupplierGroups />} />
              <Route path="/inventory/stock-transfer" element={<StockTransfer />} />
              
              {/* Accounting Routes */}
              <Route path="/accounting/journal" element={<AccountingJournal />} />
              <Route path="/accounting/ledger" element={<AccountingLedger />} />
              
              {/* Reports & Settings */}
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              
              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
