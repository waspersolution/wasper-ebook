
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface CompanyPerformanceProps {
  companyName: string;
}

const CompanyPerformance: React.FC<CompanyPerformanceProps> = ({ companyName }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Performance</CardTitle>
        <CardDescription>Overview of key metrics for {companyName}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-muted rounded-lg p-4">
              <div className="text-sm font-medium text-muted-foreground">Total Sales</div>
              <div className="text-2xl font-bold">$0</div>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <div className="text-sm font-medium text-muted-foreground">Inventory Value</div>
              <div className="text-2xl font-bold">$0</div>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <div className="text-sm font-medium text-muted-foreground">Users</div>
              <div className="text-2xl font-bold">0</div>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <div className="text-sm font-medium text-muted-foreground">Last Backup</div>
              <div className="text-2xl font-bold">Never</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyPerformance;
