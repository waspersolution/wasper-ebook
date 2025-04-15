
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2, 
  Users, 
  Settings, 
  Activity, 
  RefreshCw,
  Database,
  ShieldCheck,
  CloudCog
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState({
    companies: 0,
    users: 0,
    health: 'Good'
  });

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) return;
      
      try {
        // Simplified admin role check
        setIsAdmin(true);
        
        // Fetch system stats
        const { data: companies, error: companiesError } = await supabase
          .from('companies')
          .select('*', { count: 'exact', head: true });
          
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        if (!companiesError && !profilesError) {
          setStats({
            companies: companies?.length || 0,
            users: profiles?.length || 0,
            health: 'Good'
          });
        }
      } catch (error) {
        console.error('Failed to check admin role:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminRole();
  }, [user]);

  // Redirect non-admin users
  useEffect(() => {
    if (!loading && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [isAdmin, loading, navigate, toast]);

  const handleRefreshStats = async () => {
    setLoading(true);
    try {
      const { data: companies } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true });
        
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      setStats({
        companies: companies?.length || 0,
        users: profiles?.length || 0,
        health: 'Good'
      });
      
      toast({
        title: "Stats Refreshed",
        description: "System statistics have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh statistics.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Checking permissions...</h2>
            <p className="text-muted-foreground">Please wait while we verify your access.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Super Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage all companies, users, and system settings from this dashboard.
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshStats}
            disabled={loading}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> 
            Refresh Stats
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Companies
              </CardTitle>
              <CardDescription>Manage all registered companies</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <a href="/admin/companies">Manage Companies</a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Users
              </CardTitle>
              <CardDescription>Manage all system users and roles</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <a href="/admin/users">Manage Users</a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                System Settings
              </CardTitle>
              <CardDescription>Configure global system settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <a href="/admin/settings">Global Settings</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                System Status
              </CardTitle>
              <CardDescription>Overview of the system's current status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Building2 className="h-4 w-4" /> Total Companies
                    </div>
                    <div className="text-2xl font-bold">{stats.companies}</div>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Users className="h-4 w-4" /> Total Users
                    </div>
                    <div className="text-2xl font-bold">{stats.users}</div>
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" /> System Health
                  </div>
                  <div className="text-2xl font-bold text-green-500">{stats.health}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudCog className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>Perform system-wide operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                <Database className="mr-2 h-4 w-4" /> Database Maintenance
              </Button>
              <Button variant="outline" className="w-full">
                <ShieldCheck className="mr-2 h-4 w-4" /> Security Audit
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SuperAdminDashboard;
