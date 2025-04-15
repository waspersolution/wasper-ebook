
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';

const BranchUsersSection: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Branch Users</CardTitle>
        <CardDescription>Users assigned to this branch</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center py-4">
          User assignment feature will be available soon.
        </p>
      </CardContent>
    </Card>
  );
};

export default BranchUsersSection;
