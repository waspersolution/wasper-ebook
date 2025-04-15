
import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import CardHeaderComponent from './card/CardHeader';
import CompanyInfo from './card/CompanyInfo';
import BranchList from './card/BranchList';

export interface CompanyCardProps {
  company: {
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
  };
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Not set';
  try {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  } catch (error) {
    return 'Invalid date';
  }
};

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  return (
    <Card key={company.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardHeaderComponent 
          id={company.id}
          name={company.name}
          status={company.status}
          currency={company.currency}
        />
      </CardHeader>
      
      <CardContent className="pt-2">
        <CompanyInfo 
          address={company.address}
          phone={company.phone}
          email={company.email}
          financialYearStart={company.financial_year_start}
          taxId={company.tax_id}
          formatDate={formatDate}
        />
        
        <BranchList companyId={company.id} />
      </CardContent>

      <CardFooter className="pt-2 flex justify-end">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/company/${company.id}`} className="flex items-center gap-1">
            View Dashboard <ExternalLink size={14} />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CompanyCard;
