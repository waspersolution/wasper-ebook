
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface DashboardLoadingProps {
  returnPath?: string;
}

const DashboardLoading: React.FC<DashboardLoadingProps> = ({ returnPath = '/companies' }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Loading company data...</h2>
        <p className="text-muted-foreground">Please wait while we fetch the company information.</p>
        {returnPath && (
          <Button className="mt-4" variant="outline" onClick={() => navigate(returnPath)}>
            Return to Companies
          </Button>
        )}
      </div>
    </div>
  );
};

export default DashboardLoading;
