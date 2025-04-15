
import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from '@supabase/supabase-js';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import NotificationsMenu from './header/NotificationsMenu';
import UserMenu from './header/UserMenu';
import CompanyBranchDisplay from './header/CompanyBranchDisplay';
import SearchBar from './header/SearchBar';
import ContextSwitchDialog from './header/ContextSwitchDialog';

interface HeaderProps {
  toggleMobileSidebar: () => void;
  user: User;
}

const Header: React.FC<HeaderProps> = ({ toggleMobileSidebar, user }) => {
  const { companyBranch, clearCompanyBranchContext } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSwitchDialogOpen, setIsSwitchDialogOpen] = useState(false);
  const [switchType, setSwitchType] = useState<'company' | 'branch'>('company');
  const [isSwitching, setIsSwitching] = useState(false);

  const openSwitchDialog = (type: 'company' | 'branch') => {
    setSwitchType(type);
    setIsSwitchDialogOpen(true);
  };

  const handleSwitchCompany = () => {
    openSwitchDialog('company');
  };

  const handleSwitchBranch = () => {
    if (!companyBranch.companyId) {
      toast({
        title: "Error",
        description: "No company selected",
        variant: "destructive"
      });
      return;
    }
    
    openSwitchDialog('branch');
  };

  const handleConfirmSwitch = () => {
    // Set loading state immediately to prevent UI interaction
    setIsSwitching(true);
    
    // Close dialog first
    setIsSwitchDialogOpen(false);
    
    try {
      if (switchType === 'company') {
        // When switching company, clear the context completely
        clearCompanyBranchContext();
        
        // Delay navigation slightly to ensure context is cleared first
        setTimeout(() => {
          toast({
            title: "Redirecting",
            description: "Switching to company selection view..."
          });
          
          // Use replace to avoid back button issues
          window.location.href = '/';
        }, 100);
      } else {
        // When switching branch, navigate to the company page to select a branch
        setTimeout(() => {
          if (companyBranch.companyId) {
            toast({
              title: "Redirecting",
              description: "Switching to branch selection view..."
            });
            
            // Use replace to avoid back button issues
            window.location.href = `/company/${companyBranch.companyId}`;
          } else {
            // Fallback if no company ID
            window.location.href = '/';
          }
        }, 100);
      }
    } catch (error) {
      console.error("Error during context switch:", error);
      
      // Reset switching state on error
      setIsSwitching(false);
      
      toast({
        title: "Error",
        description: "Failed to switch context. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <header className="bg-background border-b border-border h-16 flex items-center px-4 sticky top-0 z-20">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={toggleMobileSidebar}
              disabled={isSwitching}
            >
              <Menu size={20} />
            </Button>
            
            <CompanyBranchDisplay 
              onSwitchCompany={handleSwitchCompany}
              onSwitchBranch={handleSwitchBranch}
              disabled={isSwitching}
            />
            
            <SearchBar />
          </div>

          <div className="flex items-center gap-2">
            <NotificationsMenu />
            
            <UserMenu 
              user={user} 
              onSwitchCompany={handleSwitchCompany} 
              onSwitchBranch={handleSwitchBranch} 
              disabled={isSwitching}
            />
          </div>
        </div>
      </header>

      <ContextSwitchDialog 
        isOpen={isSwitchDialogOpen}
        onOpenChange={setIsSwitchDialogOpen}
        switchType={switchType}
        onConfirm={handleConfirmSwitch}
        isLoading={isSwitching}
      />
    </>
  );
};

export default Header;
