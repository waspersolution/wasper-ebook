
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Company {
  id: string;
  name: string;
  financial_year_start: string | null;
  book_start_date: string | null;
  isDefault?: boolean;
  role?: string;
  has_branches?: boolean;
}

interface CompanySelectionProps {
  companies: Company[];
  onCompanySelect: (companyId: string) => void;
}

const CompanySelection: React.FC<CompanySelectionProps> = ({ companies, onCompanySelect }) => {
  const { toast } = useToast();

  const handleCompanySelect = (companyId: string) => {
    onCompanySelect(companyId);
    toast({
      title: "Company selected",
      description: "You'll be redirected to the company dashboard."
    });
  };

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Select a Company for This Session</h1>
      <p className="text-muted-foreground mb-6">
        Each company has its own isolated data. Select which company you want to access now.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {companies.map((company) => (
          <Card 
            key={company.id} 
            className={`hover:bg-muted/50 transition-colors ${company.isDefault ? 'border-primary' : ''}`}
          >
            <CardHeader>
              <CardTitle>{company.name}</CardTitle>
              {company.isDefault && (
                <span className="text-xs text-primary font-medium">Default Company</span>
              )}
              {company.role && (
                <span className="text-xs text-muted-foreground">Your role: {company.role}</span>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Financial Year: {company.financial_year_start ? new Date(company.financial_year_start).toLocaleDateString() : 'Not set'}
              </p>
              {company.has_branches && (
                <p className="text-sm text-muted-foreground mt-1">
                  This company has multiple branches
                </p>
              )}
              <Button 
                variant="default"
                className="w-full mt-4"
                onClick={() => handleCompanySelect(company.id)}
              >
                Access This Company
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default CompanySelection;
