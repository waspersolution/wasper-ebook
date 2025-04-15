
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface DashboardCategoryCardProps {
  title: string;
  icon: LucideIcon;
  href: string;
}

const DashboardCategoryCard: React.FC<DashboardCategoryCardProps> = ({ title, icon: Icon, href }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Icon className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <a href={href}>View Details</a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default DashboardCategoryCard;
