
import React from 'react';
import { LogOut, UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from '@supabase/supabase-js';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Building, Home } from 'lucide-react';

interface UserMenuProps {
  user: User;
  onSwitchCompany: () => void;
  onSwitchBranch: () => void;
  disabled?: boolean;
}

const UserMenu: React.FC<UserMenuProps> = ({ 
  user,
  onSwitchCompany,
  onSwitchBranch,
  disabled = false
}) => {
  const { signOut, companyBranch } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2" disabled={disabled}>
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            {user.email ? user.email[0].toUpperCase() : 'U'}
          </div>
          <span className="hidden md:inline">{user.email?.split('@')[0]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
          </DropdownMenuItem>
          {companyBranch.companyName && (
            <DropdownMenuItem onClick={onSwitchCompany} disabled={disabled}>
              <Building className="mr-2 h-4 w-4" />
              <span>Switch Company</span>
            </DropdownMenuItem>
          )}
          {companyBranch.branchName && (
            <DropdownMenuItem onClick={onSwitchBranch} disabled={disabled}>
              <Home className="mr-2 h-4 w-4" />
              <span>Switch Branch</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} disabled={disabled}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
