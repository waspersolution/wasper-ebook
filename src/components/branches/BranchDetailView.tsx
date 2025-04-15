
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Branch } from '@/services/types';

interface BranchDetailsProps {
  branch: Branch;
}

const BranchDetailView: React.FC<BranchDetailsProps> = ({ branch }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{branch.name}</CardTitle>
            <CardDescription>Branch ID: {branch.id}</CardDescription>
          </div>
          {branch.is_main_branch && (
            <Badge variant="outline" className="bg-primary/10 text-primary">
              Main Branch
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {branch.address && (
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <span className="text-sm">{branch.address}</span>
          </div>
        )}
        
        {branch.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm">{branch.phone}</span>
          </div>
        )}
        
        {branch.email && (
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm">{branch.email}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BranchDetailView;
