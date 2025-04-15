
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import DashboardLoading from '@/components/company/dashboard/DashboardLoading';
import CompanyNotFound from '@/components/company/dashboard/CompanyNotFound';
import DashboardCategoriesGrid from '@/components/company/dashboard/DashboardCategoriesGrid';
import CompanyPerformance from '@/components/company/dashboard/CompanyPerformance';

interface Company {
  id: string;
  name: string;
  address: string | null;
  email: string | null;
  owner_id: string | null;
}

const CompanyAdminDashboard = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const { user, companyBranch, updateCompanyBranch } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  // When this component loads and we have a companyId in URL but not in context, update context
  useEffect(() => {
    if (companyId && (!companyBranch.companyId || companyBranch.companyId !== companyId)) {
      updateCompanyBranch({ companyId });
    }
  }, [companyId, companyBranch.companyId, updateCompanyBranch]);

  useEffect(() => {
    const fetchCompany = async () => {
      if (!companyId || !user) return;

      try {
        // Fetch company details
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', companyId)
          .single();

        if (companyError) {
          throw companyError;
        }

        setCompany(companyData);

        // Check if user is owner or has admin rights to this company
        // This is simplified - in a real app, you'd check user_roles or a company_users table
        const isOwner = companyData.owner_id === user.id;
        
        // For now, we're allowing the owner to access the company dashboard
        // In a real app, you'd check for admin role for this specific company
        setHasAccess(isOwner);
      } catch (error: any) {
        console.error('Error fetching company:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to load company data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyId, user, toast]);

  // Redirect if no access
  useEffect(() => {
    if (!loading && !hasAccess) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this company's dashboard.",
        variant: "destructive",
      });
      navigate('/companies');
    }
  }, [hasAccess, loading, navigate, toast]);

  if (loading) {
    return (
      <Layout requireContext={false}>
        <DashboardLoading />
      </Layout>
    );
  }

  if (!company) {
    return (
      <Layout requireContext={false}>
        <CompanyNotFound />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{company.name} Dashboard</h1>
          <p className="text-muted-foreground">
            Manage company users, sales, inventory, and backups.
          </p>
        </div>

        <DashboardCategoriesGrid companyId={company.id} />
        <CompanyPerformance companyName={company.name} />
      </div>
    </Layout>
  );
};

export default CompanyAdminDashboard;
