
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ShoppingCart } from 'lucide-react';
import { SidebarItem } from '../SidebarItem';

interface SalesMenuProps {
  isCurrentPath: (path: string) => boolean;
  openMenus: Record<string, boolean>;
  toggleMenu: (menuName: string) => void;
}

export const SalesMenu: React.FC<SalesMenuProps> = ({
  isCurrentPath,
  openMenus,
  toggleMenu
}) => {
  return (
    <SidebarItem
      icon={<ShoppingCart size={18} />}
      label="Sales"
      path="#"
      isActive={false}
      hasChildren={true}
      isOpen={openMenus.sales}
      toggleOpen={() => toggleMenu('sales')}
    >
      <Link 
        to="/sales/orders" 
        className={cn(
          "block py-2 px-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
          isCurrentPath('/sales/orders') && "bg-sidebar-accent text-sidebar-accent-foreground"
        )}
      >
        Sales Orders
      </Link>
      <Link 
        to="/sales/invoices" 
        className={cn(
          "block py-2 px-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
          isCurrentPath('/sales/invoices') && "bg-sidebar-accent text-sidebar-accent-foreground"
        )}
      >
        Invoices
      </Link>
      <Link 
        to="/sales/pos" 
        className={cn(
          "block py-2 px-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
          isCurrentPath('/sales/pos') && "bg-sidebar-accent text-sidebar-accent-foreground"
        )}
      >
        POS
      </Link>
    </SidebarItem>
  );
};
