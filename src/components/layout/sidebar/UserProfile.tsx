
import React from 'react';

export const UserProfile: React.FC = () => {
  return (
    <div className="p-4 border-t border-sidebar-border">
      <div className="flex items-center gap-3 text-sidebar-foreground">
        <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground">
          A
        </div>
        <div>
          <p className="text-sm font-medium">Admin User</p>
          <p className="text-xs opacity-70">admin@wasper.com</p>
        </div>
      </div>
    </div>
  );
};
