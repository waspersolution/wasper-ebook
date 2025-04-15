
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Package, Users, Database, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Company {
  id: string;
  name: string;
  address: string | null;
  email: string | null;
  owner_id: string | null;
}

interface Branch {
  id: string;
  name: string;
  address: string | null;
  is_main_branch?: boolean;
}

const CompanyAdminDashboard = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const [searchParams] = useSearchParams();
  const branchId = searchParams.get('branchId');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [company, setCompany] = useState<Company | null>(null);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(true); // Default to true for now until we implement proper role checking

  useEffect(() => {
    const fetchCompanyAndBranch = async () => {
      if (!companyId || !user) return;
      
      try {
        // Fetch company details
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', companyId)
          .single();
          
        if (companyError) {
          throw companyError;
        }
        
        setCompany(companyData);
        
        // Store company info in localStorage for persistence
        localStorage.setItem('selectedCompanyId', companyId);
        localStorage.setItem('selectedCompanyName', companyData.name);
        
        // Fetch branch details if branchId is provided
        if (branchId) {
          const { data: branchData, error: branchError } = await supabase
            .from('branches')
            .select('*')
            .eq('id', branchId)
            .single();
            
          if (!branchError) {
            setBranch(branchData);
            
            // Store branch info in localStorage for persistence
            localStorage.setItem('selectedBranchId', branchId);
            localStorage.setItem('selectedBranchName', branchData.name);
          } else {
            // If there's an error fetching the branch, try to get the main branch
            const { data: mainBranchData, error: mainBranchError } = await supabase
              .from('branches')
              .select('*')
              .eq('company_id', companyId)
              .eq('is_main_branch', true)
              .single();
              
            if (!mainBranchError && mainBranchData) {
              setBranch(mainBranchData);
              
              // Store branch info in localStorage for persistence
              localStorage.setItem('selectedBranchId', mainBranchData.id);
              localStorage.setItem('selectedBranchName', mainBranchData.name);
            }
          }
        } else {
          // If no branchId is provided, try to get it from localStorage or fetch the main branch
          const storedBranchId = localStorage.getItem('selectedBranchId');
          
          if (storedBranchId) {
            const { data: branchData, error: branchError } = await supabase
              .from('branches')
              .select('*')
              .eq('id', storedBranchId)
              .single();
              
            if (!branchError) {
              setBranch(branchData);
            }
          } else {
            // Try to get the main branch
            const { data: mainBranchData, error: mainBranchError } = await supabase
              .from('branches')
              .select('*')
              .eq('company_id', companyId)
              .eq('is_main_branch', true)
              .single();
              
            if (!mainBranchError && mainBranchData) {
              setBranch(mainBranchData);
              
              // Store branch info in localStorage for persistence
              localStorage.setItem('selectedBranchId', mainBranchData.id);
              localStorage.setItem('selectedBranchName', mainBranchData.name);
            }
          }
        }
        
        // For now we're just setting hasAccess to true
        // In a real implementation, we would check if the user has appropriate role for this company
        setHasAccess(true);
        
      } catch (error: any) {
        console.error('Error fetching company:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to load company data',
          variant: 'destructive',
        });
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompanyAndBranch();
  }, [companyId, branchId, user, toast]);

  // Redirect if no access
  useEffect(() => {
    if (!loading && !hasAccess) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this company's dashboard.",
        variant: "destructive",
      });
      navigate('/companies');
    }
  }, [hasAccess, loading, navigate, toast]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Loading company data...</h2>
            <p className="text-muted-foreground">Please wait while we fetch the company information.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!company) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Company Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested company could not be found.</p>
            <Button asChild>
              <Link to="/companies">Return to Companies</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{company.name} Dashboard</h1>
              {branch && (
                <p className="text-sm text-muted-foreground">
                  Branch: {branch.name}
                </p>
              )}
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="sm:self-end"
            >
              Switch Company/Branch
            </Button>
          </div>
          <p className="text-muted-foreground mt-2">
            Manage company users, sales, inventory, and backups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <BarChart3 className="h-4 w-4 text-primary" />
                Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to={`/company/${companyId}/dashboard`}>View Details</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-primary" />
                Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to={`/company/${companyId}/users`}>Manage Users</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <ShoppingCart className="h-4 w-4 text-primary" />
                Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to={`/company/${companyId}/sales`}>Manage Sales</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Package className="h-4 w-4 text-primary" />
                Inventory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to={`/company/${companyId}/inventory`}>Manage Inventory</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Database className="h-4 w-4 text-primary" />
                Backup & Restore
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to={`/company/${companyId}/backup`}>Manage Backups</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Company Performance</CardTitle>
            <CardDescription>Overview of key metrics for {company.name}{branch ? ` - ${branch.name}` : ''}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-sm font-medium text-muted-foreground">Total Sales</div>
                  <div className="text-2xl font-bold">$0</div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-sm font-medium text-muted-foreground">Inventory Value</div>
                  <div className="text-2xl font-bold">$0</div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-sm font-medium text-muted-foreground">Users</div>
                  <div className="text-2xl font-bold">0</div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-sm font-medium text-muted-foreground">Last Backup</div>
                  <div className="text-2xl font-bold">Never</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CompanyAdminDashboard;
