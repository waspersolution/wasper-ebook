
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import CompanyForm from '@/components/companies/CompanyForm';
import CompanyHeader from '@/components/companies/CompanyHeader';
import CompanyList, { Company } from '@/components/companies/CompanyList';

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCompanyFormOpen, setIsCompanyFormOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      
      if (!user) {
        setCompanies([]);
        return;
      }

      // Fetch only companies associated with the current user
      const { data, error } = await supabase
        .from('user_companies')
        .select(`
          company_id,
          role,
          companies (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      // Extract the companies from the user_companies data and add the status field
      const userCompanies = data?.map(item => {
        // First extract the companies data
        const companyData = item.companies as Omit<Company, 'status'>;
        
        // Then add the status field to match the Company type
        return {
          ...companyData,
          status: 'active' as const // Explicitly set as active
        };
      }) || [];
      
      setCompanies(userCompanies);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch companies',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [user, toast]);

  return (
    <Layout>
      <div className="space-y-6">
        <CompanyHeader 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddClick={() => setIsCompanyFormOpen(true)}
        />
        
        <CompanyList 
          companies={companies}
          searchQuery={searchQuery}
          isLoading={isLoading}
        />
      </div>

      <CompanyForm 
        open={isCompanyFormOpen} 
        onOpenChange={setIsCompanyFormOpen}
        onCompanyCreated={fetchCompanies}
      />
    </Layout>
  );
};

export default Companies;
