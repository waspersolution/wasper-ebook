
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Package, ArrowDownUp } from 'lucide-react';
import { SidebarItem } from '../SidebarItem';

interface InventoryMenuProps {
  isCurrentPath: (path: string) => boolean;
  openMenus: Record<string, boolean>;
  toggleMenu: (menuName: string) => void;
}

export const InventoryMenu: React.FC<InventoryMenuProps> = ({
  isCurrentPath,
  openMenus,
  toggleMenu
}) => {
  return (
    <SidebarItem
      icon={<Package size={18} />}
      label="Inventory"
      path="#"
      isActive={false}
      hasChildren={true}
      isOpen={openMenus.inventory}
      toggleOpen={() => toggleMenu('inventory')}
    >
      <Link 
        to="/inventory/products" 
        className={cn(
          "block py-2 px-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
          isCurrentPath('/inventory/products') && "bg-sidebar-accent text-sidebar-accent-foreground"
        )}
      >
        Products
      </Link>
      <Link 
        to="/inventory/item-groups" 
        className={cn(
          "block py-2 px-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
          isCurrentPath('/inventory/item-groups') && "bg-sidebar-accent text-sidebar-accent-foreground"
        )}
      >
        Item Groups
      </Link>
      <Link 
        to="/inventory/stock" 
        className={cn(
          "block py-2 px-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
          isCurrentPath('/inventory/stock') && "bg-sidebar-accent text-sidebar-accent-foreground"
        )}
      >
        Stock
      </Link>
      <Link 
        to="/inventory/stock-transfer" 
        className={cn(
          "block py-2 px-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
          isCurrentPath('/inventory/stock-transfer') && "bg-sidebar-accent text-sidebar-accent-foreground"
        )}
      >
        Stock Transfer
      </Link>
      <Link 
        to="/inventory/suppliers" 
        className={cn(
          "block py-2 px-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
          isCurrentPath('/inventory/suppliers') && "bg-sidebar-accent text-sidebar-accent-foreground"
        )}
      >
        Suppliers
      </Link>
      <Link 
        to="/inventory/supplier-groups" 
        className={cn(
          "block py-2 px-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
          isCurrentPath('/inventory/supplier-groups') && "bg-sidebar-accent text-sidebar-accent-foreground"
        )}
      >
        Supplier Groups
      </Link>
    </SidebarItem>
  );
};
