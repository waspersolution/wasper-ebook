
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { fetchUserCompanies, fetchCompanyBranches, setCompanyAsDefault } from '@/services/companyService';
import { Company, Branch } from '@/types/company';

export function useCompanyBranchSelection() {
  const { user, companyBranch, updateCompanyBranch } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<{id: string, name: string} | null>(null);
  const [branchesLoading, setBranchesLoading] = useState(false);

  // Check if we already have a company and branch context
  useEffect(() => {
    if (companyBranch.companyId && companyBranch.branchId) {
      // We already have a context, route to dashboard
      navigate(`/company/${companyBranch.companyId}/dashboard`);
    }
  }, [companyBranch, navigate]);

  useEffect(() => {
    const loadCompanies = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const companiesData = await fetchUserCompanies(user.id);
        setCompanies(companiesData);
        
        // If there's only one company, select it automatically
        if (companiesData.length === 1) {
          handleCompanySelect(companiesData[0].id);
        }
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, [user, toast]);

  const handleCompanySelect = async (companyId: string) => {
    const selectedComp = companies.find(c => c.id === companyId);
    setSelectedCompany({
      id: companyId,
      name: selectedComp?.name || ''
    });
    
    // Update the company context
    updateCompanyBranch({
      companyId,
      companyName: selectedComp?.name || ''
    });
    
    setBranchesLoading(true);
    try {
      const branchesData = await fetchCompanyBranches(companyId, user?.id || '');
      
      setBranches(branchesData);
      
      // If there's only one branch, select it automatically
      if (branchesData.length === 1) {
        handleBranchSelect(branchesData[0].id, branchesData[0].name);
      }
    } catch (error: any) {
      toast({
        title: 'Error fetching branches',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setBranchesLoading(false);
    }
  };

  const handleBranchSelect = async (branchId: string, branchName: string) => {
    if (!selectedCompany) return;
    
    try {
      // First set this company as default
      await setCompanyAsDefault(user?.id || '', selectedCompany.id);
      
      // Update company/branch context
      updateCompanyBranch({
        companyId: selectedCompany.id,
        companyName: selectedCompany.name,
        branchId: branchId,
        branchName: branchName
      });
      
      // Show confirmation toast
      toast({
        title: 'Context selected',
        description: `${selectedCompany.name} / ${branchName} context is now active`,
      });
      
      // Navigate directly to company dashboard
      navigate(`/company/${selectedCompany.id}/dashboard`);
    } catch (error: any) {
      toast({
        title: 'Error setting default company',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleBackToCompanies = () => {
    setSelectedCompany(null);
    setBranches([]);
  };

  return {
    companies,
    branches,
    loading,
    branchesLoading,
    selectedCompany,
    handleCompanySelect,
    handleBranchSelect,
    handleBackToCompanies
  };
}
