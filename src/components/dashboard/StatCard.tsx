
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  footer?: React.ReactNode;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColor = "text-primary",
  iconBgColor = "bg-primary/10",
  footer,
  className
}) => {
  return (
    <div className={cn("rounded-lg border bg-card p-6 shadow-sm", className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <div className={cn("p-2 rounded-full", iconBgColor)}>
          <Icon size={20} className={iconColor} />
        </div>
      </div>
      {footer && (
        <div className="mt-4 flex items-center text-xs">
          {footer}
        </div>
      )}
    </div>
  );
};

export default StatCard;
