
import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useRoles } from '@/hooks/useRoles';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

import UserManagementHeader from '@/components/user/UserManagementHeader';
import UserActionButtons from '@/components/user/UserActionButtons';
import UserSearchBar from '@/components/user/UserSearchBar';
import UserList from '@/components/user/UserList';
import UserRoleAssignment from '@/components/user/UserRoleAssignment';
import InviteUserDialog from '@/components/user/dialogs/InviteUserDialog';
import { useUserManagement } from '@/hooks/useUserManagement';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const { roles, fetchRoles } = useRoles();
  
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
    fetchRoles();
  }, []);

  const handleOpenRoleAssignment = (userId: string) => {
    setSelectedUserId(userId);
    setIsRoleDialogOpen(true);
  };

  const handleRoleAssignmentSuccess = () => {
    setIsRoleDialogOpen(false);
    fetchUsers();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
          <UserManagementHeader />
          <UserActionButtons 
            onRefresh={fetchUsers} 
            onAddUser={() => setIsInviteDialogOpen(true)} 
          />
        </div>

        <UserSearchBar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <UserList 
          users={users}
          loading={loading}
          searchTerm={searchTerm}
          onAssignRole={handleOpenRoleAssignment}
          onResendInvite={handleResendInvitation}
        />
      </div>

      <InviteUserDialog 
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        onSubmit={handleInviteSubmit}
      />

      {/* Role Assignment Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>
              Assign a role with specific permissions to this user.
            </DialogDescription>
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
    </Layout>
  );
};

export default UserManagement;
