
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Branch {
  id: string;
  name: string;
  address: string | null;
  is_main_branch?: boolean;
}

interface BranchSelectionListProps {
  branches: Branch[];
  companyName: string;
  onBranchSelect: (branchId: string, branchName: string) => void;
  onBack: () => void;
}

const BranchSelectionList: React.FC<BranchSelectionListProps> = ({ 
  branches, 
  companyName, 
  onBranchSelect,
  onBack
}) => {
  return (
    <>
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={onBack} className="mr-2">
          Back to Companies
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Select a Branch for {companyName}</h1>
      </div>
      <p className="text-muted-foreground mb-6">
        Select which branch you want to access.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {branches.map((branch) => (
          <Card 
            key={branch.id} 
            className={`hover:bg-muted/50 transition-colors cursor-pointer ${branch.is_main_branch ? 'border-primary' : ''}`}
            onClick={() => onBranchSelect(branch.id, branch.name)}
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{branch.name}</span>
                {branch.is_main_branch && (
                  <Badge variant="outline" className="bg-primary/10 text-primary">Main Branch</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {branch.address && (
                <p className="text-sm text-muted-foreground mb-4">
                  {branch.address}
                </p>
              )}
              <Button 
                variant="default"
                className="w-full mt-4"
                onClick={(e) => {
                  e.stopPropagation();
                  onBranchSelect(branch.id, branch.name);
                }}
              >
                Access This Branch
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default BranchSelectionList;
