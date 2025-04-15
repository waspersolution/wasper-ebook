
import React from 'react';
import Layout from '@/components/layout/Layout';
import { useCompanyBranchSelection } from '@/hooks/useCompanyBranchSelection';
import LoadingState from '@/components/companies/LoadingState';
import EmptyState from '@/components/companies/EmptyState';
import CompanySelectionList from '@/components/companies/selection/CompanySelectionList';
import BranchSelectionList from '@/components/companies/selection/BranchSelectionList';
import LoadingView from '@/components/companies/selection/LoadingView';

const Index = () => {
  const {
    companies,
    branches,
    loading,
    branchesLoading,
    selectedCompany,
    handleCompanySelect,
    handleBranchSelect,
    handleBackToCompanies
  } = useCompanyBranchSelection();
  
  // Show loading state
  if (loading) {
    return (
      <Layout>
        <LoadingState />
      </Layout>
    );
  }
  
  // Show empty state if no companies
  if (companies.length === 0) {
    return (
      <Layout>
        <EmptyState />
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="space-y-6">
        {selectedCompany ? (
          branchesLoading ? (
            <LoadingView />
          ) : (
            <BranchSelectionList 
              branches={branches}
              companyName={selectedCompany.name}
              onBranchSelect={handleBranchSelect}
              onBack={handleBackToCompanies}
            />
          )
        ) : (
          <CompanySelectionList 
            companies={companies}
            onCompanySelect={handleCompanySelect}
          />
        )}
      </div>
    </Layout>
  );
};

export default Index;
