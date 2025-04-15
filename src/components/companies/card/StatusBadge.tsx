
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'active' | 'inactive';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <Badge 
      variant="outline" 
      className={cn(
        status === "active" 
          ? "text-green-700 bg-green-50 border-green-200" 
          : "text-red-700 bg-red-50 border-red-200"
      )}
    >
      {status === "active" ? (
        <>
          <CheckCircle className="mr-1 h-3 w-3" />
          Active
        </>
      ) : (
        <>
          <XCircle className="mr-1 h-3 w-3" />
          Inactive
        </>
      )}
    </Badge>
  );
};

export default StatusBadge;
