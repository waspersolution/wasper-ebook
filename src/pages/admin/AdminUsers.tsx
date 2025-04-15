
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, RefreshCw, Search } from 'lucide-react';
import { supabase, supabaseAdmin } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import InviteUserForm from '@/components/user/InviteUserForm';
import { InviteFormValues } from '@/components/user/invite-form/UserInviteSchema';
import { useUserManagement } from '@/hooks/useUserManagement';
import UserList from '@/components/user/UserList';
import UserRoleAssignment from '@/components/user/UserRoleAssignment';
import InviteUserDialog from '@/components/user/dialogs/InviteUserDialog';

const AdminUsers = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  
  const {
    users,
    loading,
    selectedUserId,
    setSelectedUserId,
    fetchUsers,
    handleInviteSubmit,
    handleResendInvitation,
  } = useUserManagement();

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenRoleAssignment = (userId: string) => {
    setSelectedUserId(userId);
    setIsRoleDialogOpen(true);
  };

  const handleRoleAssignmentSuccess = () => {
    setIsRoleDialogOpen(false);
    fetchUsers(); // Refresh the user list after role assignment
  };

  // Create a wrapper function that matches the expected return type
  const handleSubmitWrapper = async (values: InviteFormValues): Promise<void> => {
    await handleInviteSubmit(values);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Users Management</h1>
            <p className="text-muted-foreground">
              Manage system users and their access permissions
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={fetchUsers} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
            <Button size="sm" onClick={() => setIsInviteDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" /> Add User
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

        <UserList 
          users={users}
          loading={loading}
          searchTerm={searchTerm}
          onAssignRole={handleOpenRoleAssignment}
          onResendInvite={handleResendInvitation}
        />

        {/* Invite User Dialog - Now using the wrapper function */}
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <InviteUserForm
              onSubmit={handleSubmitWrapper}
              onCancel={() => setIsInviteDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Role Assignment Dialog */}
        <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Assign Role</DialogTitle>
            </DialogHeader>
            {selectedUserId && (
              <UserRoleAssignment
                userId={selectedUserId}
                onSuccess={handleRoleAssignmentSuccess}
                onCancel={() => setIsRoleDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default AdminUsers;
