
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface Branch {
  id: string;
  name: string;
  address: string | null;
  is_main_branch: boolean | null;
  manager?: string;  // This would come from a join with profiles in a real implementation
  status: 'active' | 'inactive';  // This would come from a status column in a real implementation
}

interface BranchListProps {
  companyId: string;
}

const BranchList: React.FC<BranchListProps> = ({ companyId }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('branches')
          .select('id, name, address, is_main_branch')
          .eq('company_id', companyId)
          .limit(3);
        
        if (error) throw error;
        
        const branchesWithManager = data.map(branch => ({
          ...branch,
          manager: 'Not assigned', // This would come from a join with profiles
          status: 'active' as const  // This would come from a status column
        }));
        
        setBranches(branchesWithManager);
      } catch (error: any) {
        console.error("Error fetching branches:", error);
        // Don't show toast for card component
      } finally {
        setLoading(false);
      }
    };
    
    fetchBranches();
  }, [companyId]);

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">Branches</h4>
        <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
          <Link to={`/company/${companyId}/branches`}>
            <Plus className="mr-1 h-3 w-3" />
            Manage
          </Link>
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-4">
          <p className="text-xs text-muted-foreground">Loading branches...</p>
        </div>
      ) : branches.length > 0 ? (
        <div className="space-y-2">
          {branches.map(branch => (
            <div 
              key={branch.id} 
              className="p-3 bg-muted/50 rounded-md flex justify-between items-center"
            >
              <div>
                <p className="font-medium flex items-center">
                  {branch.name} 
                  {branch.is_main_branch && (
                    <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">Main</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">{branch.address || 'No address'}</p>
              </div>
              <Badge variant="outline" className={branch.status === "active" ? "bg-green-50 text-green-700" : ""}>
                {branch.status}
              </Badge>
            </div>
          ))}
          
          {branches.length === 3 && (
            <Link 
              to={`/company/${companyId}/branches`}
              className="block text-center text-xs text-primary hover:underline py-1"
            >
              View all branches
            </Link>
          )}
        </div>
      ) : (
        <div className="p-4 bg-muted/50 rounded-md text-center">
          <p className="text-sm text-muted-foreground">No branches found</p>
          <Link 
            to={`/company/${companyId}/branches`}
            className="text-xs text-primary hover:underline block mt-1"
          >
            Create your first branch
          </Link>
        </div>
      )}
    </div>
  );
};

export default BranchList;
