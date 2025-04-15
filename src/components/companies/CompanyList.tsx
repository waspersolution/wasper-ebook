
import React from 'react';
import { Building2 } from 'lucide-react';
import CompanyCard from './CompanyCard';

export interface Company {
  id: string;
  name: string;
  address: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  owner_id: string | null;
  created_at: string;
  updated_at: string;
  status: 'active' | 'inactive';
  financial_year_start: string | null;
  book_start_date: string | null;
  tax_id: string | null;
  currency: string | null;
  admin_email: string | null;
}

interface CompanyListProps {
  companies: Company[];
  searchQuery: string;
  isLoading: boolean;
}

const CompanyList: React.FC<CompanyListProps> = ({ companies, searchQuery, isLoading }) => {
  // Filter companies based on search query
  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (company.email && company.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (company.address && company.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <p>Loading companies...</p>
      </div>
    );
  }

  if (filteredCompanies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Building2 className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium">No companies found</h3>
        <p className="text-muted-foreground mt-2 max-w-md">
          {searchQuery ? 
            `No results for "${searchQuery}". Try a different search term.` : 
            "You haven't created any companies yet. Click the 'Add Company' button to get started."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCompanies.map((company) => (
        <CompanyCard key={company.id} company={company} />
      ))}
    </div>
  );
};

export default CompanyList;
