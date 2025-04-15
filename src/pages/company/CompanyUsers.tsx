
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Mail, RefreshCw, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';

interface Company {
  id: string;
  name: string;
}

const CompanyUsers = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const { toast } = useToast();
  const [company, setCompany] = useState<Company | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!companyId) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch company details
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('id, name')
          .eq('id', companyId)
          .single();
        
        if (companyError) throw companyError;
        setCompany(companyData);
        
        // In a real app, you would fetch users associated with this company
        // For now, we'll just use dummy data
        setUsers([
          { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Manager', status: 'Active' },
          { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Staff', status: 'Active' },
          { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Staff', status: 'Invited' },
        ]);
        
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to load data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [companyId, toast]);
  
  const inviteUser = () => {
    setInviting(true);
    
    // Simulate invitation process
    setTimeout(() => {
      setInviting(false);
      toast({
        title: 'User Invited',
        description: 'An invitation email has been sent to the user.',
      });
      
      // Add the invited user to the list
      setUsers([
        ...users,
        {
          id: users.length + 1,
          name: 'New User',
          email: 'newuser@example.com',
          role: 'Staff',
          status: 'Invited'
        }
      ]);
    }, 1000);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || !company) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p>Loading company users...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{company.name} - Users</h1>
            <p className="text-muted-foreground">
              Manage users and permissions for this company
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
            <Button onClick={inviteUser} disabled={inviting} size="sm">
              <UserPlus className="mr-2 h-4 w-4" /> 
              {inviting ? "Inviting..." : "Invite User"}
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Company Users</CardTitle>
            <CardDescription>
              {filteredUsers.length} users associated with {company.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <div className="flex items-center text-sm text-muted-foreground gap-1">
                        <Mail className="h-3 w-3" /> {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.status === 'Active' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {user.status}
                      </span>
                    </div>
                    <div>
                      <select 
                        className="text-sm border rounded-md p-1"
                        defaultValue={user.role}
                      >
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Staff">Staff</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                        {user.status === 'Invited' ? 'Cancel Invite' : 'Remove'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CompanyUsers;
