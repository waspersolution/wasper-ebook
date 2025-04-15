
import React from 'react';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { CompanyFormValues } from '@/components/companies/types';
import CompanyCreateForm from '@/components/admin/company/CompanyCreateForm';

const CompanyCreate = () => {
  const { toast } = useToast();

  const handleCompanyCreated = (values: CompanyFormValues) => {
    // Additional actions after company creation (if needed)
    console.log("Company created:", values);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create New Company</h1>
          <p className="text-muted-foreground">
            Set up a new company with all required accounting and system information
          </p>
        </div>

        <CompanyCreateForm onSuccess={handleCompanyCreated} />
      </div>
    </Layout>
  );
};

export default CompanyCreate;
