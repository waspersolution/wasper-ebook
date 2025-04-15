
import React from 'react';
import { useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, BarChart3, Settings } from 'lucide-react';
import { SidebarItem } from './SidebarItem';
import { MasterDataMenu } from './navigation/MasterDataMenu';
import { SalesMenu } from './navigation/SalesMenu';
import { PurchaseMenu } from './navigation/PurchaseMenu';
import { InventoryMenu } from './navigation/InventoryMenu';
import { AccountingMenu } from './navigation/AccountingMenu';

interface SidebarNavigationProps {
  openMenus: Record<string, boolean>;
  toggleMenu: (menuName: string) => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  openMenus,
  toggleMenu
}) => {
  const location = useLocation();
  const isCurrentPath = (path: string) => location.pathname === path;

  return (
    <nav className="flex-1 py-4 overflow-y-auto">
      <ul className="px-3 space-y-1">
        <SidebarItem
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
          path="/"
          isActive={isCurrentPath('/')}
        />
        
        <SidebarItem
          icon={<Building2 size={18} />}
          label="Companies"
          path="/companies"
          isActive={isCurrentPath('/companies')}
        />

        <MasterDataMenu 
          isCurrentPath={isCurrentPath} 
          openMenus={openMenus} 
          toggleMenu={toggleMenu} 
        />
        
        <SalesMenu 
          isCurrentPath={isCurrentPath} 
          openMenus={openMenus} 
          toggleMenu={toggleMenu} 
        />
        
        <PurchaseMenu 
          isCurrentPath={isCurrentPath} 
          openMenus={openMenus} 
          toggleMenu={toggleMenu} 
        />
        
        <InventoryMenu 
          isCurrentPath={isCurrentPath} 
          openMenus={openMenus} 
          toggleMenu={toggleMenu} 
        />
        
        <AccountingMenu 
          isCurrentPath={isCurrentPath} 
          openMenus={openMenus} 
          toggleMenu={toggleMenu} 
        />

        <SidebarItem
          icon={<BarChart3 size={18} />}
          label="Reports"
          path="/reports"
          isActive={isCurrentPath('/reports')}
        />

        <SidebarItem
          icon={<Settings size={18} />}
          label="Settings"
          path="/settings"
          isActive={isCurrentPath('/settings')}
        />
      </ul>
    </nav>
  );
};
