
import React from 'react';
import DashboardCategoryCard from './DashboardCategoryCard';
import { BarChart3, Users, ShoppingCart, Package, Database } from 'lucide-react';

interface DashboardCategoriesGridProps {
  companyId: string;
}

const DashboardCategoriesGrid: React.FC<DashboardCategoriesGridProps> = ({ companyId }) => {
  const categories = [
    { 
      title: 'Dashboard', 
      icon: BarChart3, 
      href: `/company/${companyId}/dashboard` 
    },
    { 
      title: 'Users', 
      icon: Users, 
      href: `/company/${companyId}/users` 
    },
    { 
      title: 'Sales', 
      icon: ShoppingCart, 
      href: `/company/${companyId}/sales` 
    },
    { 
      title: 'Inventory', 
      icon: Package, 
      href: `/company/${companyId}/inventory` 
    },
    { 
      title: 'Backup & Restore', 
      icon: Database, 
      href: `/company/${companyId}/backup` 
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {categories.map((category) => (
        <DashboardCategoryCard
          key={category.title}
          title={category.title}
          icon={category.icon}
          href={category.href}
        />
      ))}
    </div>
  );
};

export default DashboardCategoriesGrid;
