
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
  hasChildren?: boolean;
  isOpen?: boolean;
  toggleOpen?: () => void;
  children?: React.ReactNode;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  path,
  isActive,
  hasChildren = false,
  isOpen = false,
  toggleOpen,
  children
}) => {
  return (
    <li className="mb-1">
      {hasChildren ? (
        <div className="flex flex-col">
          <button
            onClick={toggleOpen}
            className={cn(
              "flex items-center justify-between py-2 px-4 rounded-md w-full text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
              isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-5 h-5">{icon}</div>
              <span>{label}</span>
            </div>
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {isOpen && <div className="ml-6 mt-1 space-y-1">{children}</div>}
        </div>
      ) : (
        <Link
          to={path}
          className={cn(
            "flex items-center gap-3 py-2 px-4 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
            isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          )}
        >
          <div className="w-5 h-5">{icon}</div>
          <span>{label}</span>
        </Link>
      )}
    </li>
  );
};
