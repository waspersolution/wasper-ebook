
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Truck } from 'lucide-react';
import { SidebarItem } from '../SidebarItem';

interface PurchaseMenuProps {
  isCurrentPath: (path: string) => boolean;
  openMenus: Record<string, boolean>;
  toggleMenu: (menuName: string) => void;
}

export const PurchaseMenu: React.FC<PurchaseMenuProps> = ({
  isCurrentPath,
  openMenus,
  toggleMenu
}) => {
  return (
    <SidebarItem
      icon={<Truck size={18} />}
      label="Purchase"
      path="#"
      isActive={false}
      hasChildren={true}
      isOpen={openMenus.purchase}
      toggleOpen={() => toggleMenu('purchase')}
    >
      <Link 
        to="/purchase/orders" 
        className={cn(
          "block py-2 px-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
          isCurrentPath('/purchase/orders') && "bg-sidebar-accent text-sidebar-accent-foreground"
        )}
      >
        Purchase Orders
      </Link>
      <Link 
        to="/purchase/bills" 
        className={cn(
          "block py-2 px-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
          isCurrentPath('/purchase/bills') && "bg-sidebar-accent text-sidebar-accent-foreground"
        )}
      >
        Bills
      </Link>
    </SidebarItem>
  );
};
