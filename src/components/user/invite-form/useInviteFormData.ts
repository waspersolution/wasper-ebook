
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRoles } from '@/hooks/useRoles';
import { useAuth } from '@/hooks/useAuth';
import { Branch, Company } from './UserInviteSchema';

export const useInviteFormData = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Use the useRoles hook to fetch roles
  const { roles, loading: rolesLoading, fetchRoles } = useRoles();

  // Ensure roles are fetched when the component mounts
  useEffect(() => {
    console.log('Fetching roles from useInviteFormData');
    fetchRoles();
  }, [fetchRoles]);

  // Fetch companies associated with the current user
  useEffect(() => {
    const fetchUserCompanies = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data: userCompaniesData, error: userCompaniesError } = await supabase
          .from('user_companies')
          .select('company_id')
          .eq('user_id', user.id);
          
        if (userCompaniesError) {
          console.error('Error fetching user companies:', userCompaniesError);
          toast({
            title: 'Error',
            description: 'Failed to load your companies',
            variant: 'destructive',
          });
          return;
        }
        
        if (!userCompaniesData || userCompaniesData.length === 0) {
          setCompanies([]);
          return;
        }
        
        // Get the company IDs associated with the user
        const companyIds = userCompaniesData.map(uc => uc.company_id);
        
        // Now fetch the actual company details
        const { data, error } = await supabase
          .from('companies')
          .select('id, name')
          .in('id', companyIds)
          .order('name');

        if (!error && data) {
          setCompanies(data);
        } else {
          console.error('Error fetching companies:', error);
          toast({
            title: 'Error',
            description: 'Failed to load companies',
            variant: 'destructive',
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCompanies();
  }, [user, toast]);

  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('branches')
          .select('id, name, company_id')
          .order('name');

        if (!error && data) {
          setBranches(data);
        } else {
          console.error('Error fetching branches:', error);
          toast({
            title: 'Error',
            description: 'Failed to load branches',
            variant: 'destructive',
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranches();
  }, [toast]);

  console.log('Using roles in useInviteFormData:', roles);

  return {
    companies,
    branches,
    roles,
    isLoading: isLoading || rolesLoading,
    rolesLoading
  };
};
