
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Welcome to WASPER</h1>
        <p className="text-muted-foreground">
          You don't have any companies yet. Let's create your first company!
        </p>
      </div>
      
      <Button asChild size="lg">
        <Link to="/admin/companies/create" className="flex items-center gap-2">
          <PlusCircle size={18} />
          Create First Company
        </Link>
      </Button>
    </div>
  );
};

export default EmptyState;
