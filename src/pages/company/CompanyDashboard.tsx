
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import InventorySummary from '@/components/dashboard/InventorySummary';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

export default function CompanyDashboard() {
  const { companyId } = useParams<{ companyId: string }>();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { companyBranch, updateCompanyBranch } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardTab, setDashboardTab] = useState('overview');
  const navigate = useNavigate();

  // Get branchId from context, fallback to URL params if not set
  const branchId = companyBranch.branchId || searchParams.get('branchId');
  const displayCompanyName = companyBranch.companyName || 'Unknown Company';
  const displayBranchName = companyBranch.branchName || 'Unknown Branch';

  // Check if we have all the context we need
  useEffect(() => {
    if (!companyId) {
      handleMissingContext("Company information is missing");
      return;
    }
    
    // If we have companyId in URL but not in context, update context
    if (companyId && !companyBranch.companyId) {
      // Try to update the company context from URL
      updateCompanyBranch({ companyId });
    }
    
    if (!branchId) {
      // If we're missing branch ID but have company ID, redirect to branch selection
      // This is better than going all the way back to company selection
      handleMissingContext("Branch information is missing", 
        () => navigate(`/company/${companyId}`, { replace: true }));
      return;
    }

    // We have all required context
    setLoading(false);
  }, [companyId, branchId, companyBranch, updateCompanyBranch, navigate]);
  
  // Helper function to handle missing context with custom redirect
  const handleMissingContext = (message: string, redirectFn = () => navigate('/', { replace: true })) => {
    console.log(`Missing context - CompanyID: ${companyId}, BranchID: ${branchId}`);
    toast({
      title: "Missing context",
      description: `${message}. Redirecting to selection page.`,
      variant: "destructive"
    });
    
    // Show toast but don't redirect immediately, allow the toast to be seen
    setTimeout(() => {
      redirectFn();
    }, 2000);
  };

  // If loading, show loading state
  if (loading) {
    return (
      <Layout requireContext={false}>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
          {!companyId && (
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => navigate('/')}
            >
              Return to Company Selection
            </Button>
          )}
          {companyId && !branchId && (
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => navigate(`/company/${companyId}`)}
            >
              Select a Branch
            </Button>
          )}
        </div>
      </Layout>
    );
  }

  // Don't render anything until redirect happens
  if (!companyId || !branchId) {
    return null;
  }

  return (
    <Layout requireContext={false}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to {displayCompanyName} - {displayBranchName}
          </p>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="overview" value={dashboardTab} onValueChange={setDashboardTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Row */}
              <DashboardStats branchId={branchId} />
              
              {/* Two-column layout for larger screens */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <RecentTransactions branchId={branchId} className="md:col-span-3" />
                <InventorySummary branchId={branchId} className="md:col-span-2" />
              </div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Analytics content will be displayed here.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle>Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Reports content will be displayed here.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Notifications will be displayed here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Layout>
  );
}
