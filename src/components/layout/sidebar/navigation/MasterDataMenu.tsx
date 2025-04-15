
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Users } from 'lucide-react';
import { SidebarItem } from '../SidebarItem';

interface MasterDataMenuProps {
  isCurrentPath: (path: string) => boolean;
  openMenus: Record<string, boolean>;
  toggleMenu: (menuName: string) => void;
}

export const MasterDataMenu: React.FC<MasterDataMenuProps> = ({
  isCurrentPath,
  openMenus,
  toggleMenu
}) => {
  return (
    <SidebarItem
      icon={<Users size={18} />}
      label="Master Data"
      path="#"
      isActive={false}
      hasChildren={true}
      isOpen={openMenus.master}
      toggleOpen={() => toggleMenu('master')}
    >
      <Link 
        to="/users" 
        className={cn(
          "block py-2 px-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
          isCurrentPath('/users') && "bg-sidebar-accent text-sidebar-accent-foreground"
        )}
      >
        Users
      </Link>
      <Link 
        to="/branches" 
        className={cn(
          "block py-2 px-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
          isCurrentPath('/branches') && "bg-sidebar-accent text-sidebar-accent-foreground"
        )}
      >
        Branches
      </Link>
      <Link 
        to="/ledgers" 
        className={cn(
          "block py-2 px-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
          isCurrentPath('/ledgers') && "bg-sidebar-accent text-sidebar-accent-foreground"
        )}
      >
        Ledgers
      </Link>
    </SidebarItem>
  );
};
