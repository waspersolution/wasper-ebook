
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface GrowthIndicatorProps {
  value: number;
  label?: string;
}

const GrowthIndicator: React.FC<GrowthIndicatorProps> = ({ value, label = "from last month" }) => {
  const isPositive = value >= 0;
  
  return (
    <>
      {isPositive ? (
        <>
          <TrendingUp className="text-success-500 mr-1" size={14} />
          <span className="text-success-500">{value}% growth</span>
        </>
      ) : (
        <>
          <TrendingDown className="text-danger-500 mr-1" size={14} />
          <span className="text-danger-500">{Math.abs(value)}% decline</span>
        </>
      )}
      {label && <span className="text-muted-foreground ml-2">{label}</span>}
    </>
  );
};

export default GrowthIndicator;
