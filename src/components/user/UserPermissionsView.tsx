
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RolePermissions } from '@/types/roles';
import { useRoles } from '@/hooks/useRoles';
import { supabase } from '@/integrations/supabase/client';

interface UserPermissionsViewProps {
  userId: string;
}

const UserPermissionsView: React.FC<UserPermissionsViewProps> = ({ userId }) => {
  const [userRoleAssignments, setUserRoleAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { roles } = useRoles();

  useEffect(() => {
    const fetchUserRoles = async () => {
      setLoading(true);
      try {
        // Fetch user role assignments at company level
        const { data: companyRoles, error: companyError } = await supabase
          .from('user_companies')
          .select('company_id, role_id, companies(name)')
          .eq('user_id', userId);
          
        if (companyError) throw companyError;
        
        // Fetch user role assignments at branch level
        const { data: branchRoles, error: branchError } = await supabase
          .from('user_branches')
          .select('branch_id, role_id, branches(name, company_id, companies(name))')
          .eq('user_id', userId);
          
        if (branchError) throw branchError;
        
        // Combine the data
        const assignments = [
          ...(companyRoles || []).map((item: any) => ({
            role_id: item.role_id,
            scope: 'company',
            scope_id: item.company_id,
            scope_name: item.companies?.name || 'Unknown Company'
          })),
          ...(branchRoles || []).map((item: any) => ({
            role_id: item.role_id,
            scope: 'branch',
            scope_id: item.branch_id,
            scope_name: item.branches?.name || 'Unknown Branch',
            company_name: item.branches?.companies?.name || 'Unknown Company'
          }))
        ];
        
        setUserRoleAssignments(assignments);
      } catch (error) {
        console.error("Error fetching user roles:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchUserRoles();
    }
  }, [userId]);
  
  const getRoleById = (roleId: string) => {
    return roles.find(role => role.id === roleId);
  };
  
  if (loading) {
    return <div className="text-center p-4">Loading user permissions...</div>;
  }
  
  if (userRoleAssignments.length === 0) {
    return <div className="text-center p-4">No role assignments found for this user.</div>;
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">User Role Assignments</h3>
      
      <div className="grid gap-4">
        {userRoleAssignments.map((assignment, index) => {
          const role = getRoleById(assignment.role_id);
          return (
            <Card key={index}>
              <CardHeader className="py-4">
                <CardTitle className="text-base flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span>{role?.role_name || 'Unknown Role'}</span>
                  <div className="flex flex-wrap gap-2">
                    {assignment.scope === 'company' ? (
                      <Badge variant="outline">{assignment.scope_name}</Badge>
                    ) : (
                      <>
                        <Badge variant="outline">{assignment.company_name}</Badge>
                        <Badge>{assignment.scope_name}</Badge>
                      </>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {role && role.permissions ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(role.permissions as RolePermissions).map(([module, perms]) => (
                      <div key={module} className="rounded border p-3">
                        <h4 className="font-medium capitalize mb-2">{module}</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            {perms.read ? 
                              <Check className="h-4 w-4 text-green-500" /> : 
                              <X className="h-4 w-4 text-red-500" />}
                            <span>Read</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {perms.write ? 
                              <Check className="h-4 w-4 text-green-500" /> : 
                              <X className="h-4 w-4 text-red-500" />}
                            <span>Write</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {perms.delete ? 
                              <Check className="h-4 w-4 text-green-500" /> : 
                              <X className="h-4 w-4 text-red-500" />}
                            <span>Delete</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {perms.export ? 
                              <Check className="h-4 w-4 text-green-500" /> : 
                              <X className="h-4 w-4 text-red-500" />}
                            <span>Export</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4">No permission data available for this role.</div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default UserPermissionsView;
