
import React from 'react';
import { Building2, MoreHorizontal, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

interface CardHeaderProps {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  currency: string | null;
}

const CardHeader: React.FC<CardHeaderProps> = ({ id, name, status, currency }) => {
  return (
    <div className="pb-2">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            {name}
          </CardTitle>
          <CardDescription>{id.substring(0, 8)}...</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/company/${id}`}>View Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className={status === "active" ? "text-destructive" : "text-green-600"}>
              {status === "active" ? "Deactivate" : "Activate"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex items-center pt-2">
        <StatusBadge status={status} />
        {currency && (
          <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
            <CreditCard className="mr-1 h-3 w-3" />
            {currency}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default CardHeader;
