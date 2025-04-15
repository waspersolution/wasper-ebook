
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SidebarNavigation } from './sidebar/SidebarNavigation';
import { UserProfile } from './sidebar/UserProfile';

interface SidebarProps {
  isMobileOpen: boolean;
  toggleMobileSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, toggleMobileSidebar }) => {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    master: false,
    sales: false,
    purchase: false,
    inventory: false,
    accounting: false,
    reporting: false
  });

  const toggleMenu = (menuName: string) => {
    setOpenMenus((prev) => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  return (
    <>
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleMobileSidebar}
        ></div>
      )}

      <aside
        className={cn(
          "bg-sidebar h-screen fixed top-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-sidebar-foreground">WASPER</span>
          </Link>
          <button 
            onClick={toggleMobileSidebar} 
            className="md:hidden text-sidebar-foreground hover:text-sidebar-accent-foreground"
          >
            <X size={20} />
          </button>
        </div>

        <SidebarNavigation openMenus={openMenus} toggleMenu={toggleMenu} />
        <UserProfile />
      </aside>
    </>
  );
};

export default Sidebar;
