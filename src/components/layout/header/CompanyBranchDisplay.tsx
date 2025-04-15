
import React from 'react';
import { Building, Home, ArrowLeftRight, Loader2 } from 'lucide-react';
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
import { useAuth } from '@/hooks/useAuth';

interface CompanyBranchDisplayProps {
  onSwitchCompany: () => void;
  onSwitchBranch: () => void;
  disabled?: boolean;
}

const CompanyBranchDisplay: React.FC<CompanyBranchDisplayProps> = ({
  onSwitchCompany,
  onSwitchBranch,
  disabled = false
}) => {
  const { companyBranch } = useAuth();

  // Don't render anything if no company or branch selected
  if (!companyBranch.companyName && !companyBranch.branchName) {
    return null;
  }

  return (
    <div className="hidden md:flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 px-2 gap-2 relative" disabled={disabled}>
            {companyBranch.companyName && (
              <div className="flex items-center gap-1">
                <Building size={16} />
                <span className="font-medium">{companyBranch.companyName}</span>
              </div>
            )}
            {companyBranch.branchName && (
              <>
                <span className="text-muted-foreground">/</span>
                <div className="flex items-center gap-1">
                  <Home size={16} />
                  <span>{companyBranch.branchName}</span>
                </div>
              </>
            )}
            <ArrowLeftRight size={14} className="ml-1 text-muted-foreground" />
            {disabled && (
              <Loader2 size={14} className="animate-spin absolute right-1 top-1" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Current Context</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onSwitchCompany} disabled={disabled}>
            <Building className="mr-2 h-4 w-4" />
            Switch Company
          </DropdownMenuItem>
          {companyBranch.companyId && (
            <DropdownMenuItem onClick={onSwitchBranch} disabled={disabled}>
              <Home className="mr-2 h-4 w-4" />
              Switch Branch
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CompanyBranchDisplay;
