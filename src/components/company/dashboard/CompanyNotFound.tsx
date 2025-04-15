
import React from 'react';
import { Button } from '@/components/ui/button';

const CompanyNotFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Company Not Found</h2>
        <p className="text-muted-foreground mb-4">The requested company could not be found.</p>
        <Button asChild>
          <a href="/companies">Return to Companies</a>
        </Button>
      </div>
    </div>
  );
};

export default CompanyNotFound;
