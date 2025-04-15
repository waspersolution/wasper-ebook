
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { FileText } from 'lucide-react';
import { SidebarItem } from '../SidebarItem';

interface AccountingMenuProps {
  isCurrentPath: (path: string) => boolean;
  openMenus: Record<string, boolean>;
  toggleMenu: (menuName: string) => void;
}

export const AccountingMenu: React.FC<AccountingMenuProps> = ({
  isCurrentPath,
  openMenus,
  toggleMenu
}) => {
  return (
    <SidebarItem
      icon={<FileText size={18} />}
      label="Accounting"
      path="#"
      isActive={false}
      hasChildren={true}
      isOpen={openMenus.accounting}
      toggleOpen={() => toggleMenu('accounting')}
    >
      <Link 
        to="/accounting/journal" 
        className={cn(
          "block py-2 px-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
          isCurrentPath('/accounting/journal') && "bg-sidebar-accent text-sidebar-accent-foreground"
        )}
      >
        Journal Entries
      </Link>
      <Link 
        to="/accounting/ledger" 
        className={cn(
          "block py-2 px-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
          isCurrentPath('/accounting/ledger') && "bg-sidebar-accent text-sidebar-accent-foreground"
        )}
      >
        Ledger
      </Link>
    </SidebarItem>
  );
};
