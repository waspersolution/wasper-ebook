
import React from 'react';
import { Map, Phone, Mail, Calendar } from 'lucide-react';

interface CompanyInfoProps {
  address: string | null;
  phone: string | null;
  email: string | null;
  financialYearStart: string | null;
  taxId: string | null;
  formatDate: (date: string | null) => string;
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({ 
  address, 
  phone, 
  email, 
  financialYearStart, 
  taxId,
  formatDate 
}) => {
  return (
    <div className="space-y-2 text-sm">
      {address && (
        <div className="flex items-start gap-2">
          <Map className="h-4 w-4 text-muted-foreground mt-0.5" />
          <span>{address}</span>
        </div>
      )}
      {phone && (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{phone}</span>
        </div>
      )}
      {email && (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{email}</span>
        </div>
      )}
      {financialYearStart && (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>FY Start: {formatDate(financialYearStart)}</span>
        </div>
      )}
      {taxId && (
        <div className="flex items-center gap-2">
          <span className="font-medium text-xs bg-gray-100 px-2 py-0.5 rounded">
            Tax ID: {taxId}
          </span>
        </div>
      )}
    </div>
  );
};

export default CompanyInfo;
