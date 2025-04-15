
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface ContextRequiredProviderProps {
  children: React.ReactNode;
  requireContext?: boolean;
}

export const ContextRequiredProvider: React.FC<ContextRequiredProviderProps> = ({ 
  children,
  requireContext = false 
}) => {
  const { companyBranch } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [redirecting, setRedirecting] = useState(false);
  const [isValidating, setIsValidating] = useState(true);

  // Check for required context
  useEffect(() => {
    // Skip context check if not required or already redirecting
    if (!requireContext || redirecting) {
      setIsValidating(false);
      return;
    }
    
    // Mark that we're validating context
    setIsValidating(true);
    
    // Don't check on exempt paths
    const isExemptPath = 
      location.pathname === '/' || 
      location.pathname === '/auth' ||
      // Exclude the base company page with just the company ID (where branch selection happens)
      /^\/company\/[0-9a-f-]+$/i.test(location.pathname) ||
      // Exclude admin paths
      location.pathname.startsWith('/admin');
    
    if (isExemptPath) {
      setIsValidating(false);
      return;
    }
    
    // Check if we're missing company or branch context
    const missingCompany = !companyBranch.companyId;
    const missingBranch = !companyBranch.branchId;
    
    // If in company path but missing branch, redirect to company page
    const inCompanyPath = location.pathname.includes('/company/');
    const companyIdFromPath = inCompanyPath ? 
      location.pathname.split('/company/')[1]?.split('/')[0] : null;
    
    if (missingCompany || missingBranch) {
      setRedirecting(true);
      
      let redirectPath = '/';
      let message = "Context Required";
      let description = "Please select a company and branch to continue.";
      
      // If we're in a company path but just missing branch, redirect to company page
      if (inCompanyPath && companyIdFromPath && missingBranch && !missingCompany) {
        redirectPath = `/company/${companyIdFromPath}`;
        description = "Please select a branch to continue.";
      }
      
      console.log(`Missing context - CompanyID: ${companyBranch.companyId}, BranchID: ${companyBranch.branchId}`);
      
      toast({
        title: message,
        description: description,
      });
      
      // Use window.location for a full page reload to prevent React state issues
      setTimeout(() => {
        window.location.href = redirectPath;
      }, 100);
    } else {
      // Context is valid, continue rendering
      setIsValidating(false);
    }
  }, [requireContext, companyBranch, location.pathname, navigate, toast, redirecting]);

  if (isValidating) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return <>{children}</>;
};
