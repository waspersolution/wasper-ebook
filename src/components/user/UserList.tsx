
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UserCard from './list/UserCard';
import EmptyState from './list/EmptyState';
import LoadingState from './list/LoadingState';

interface UserListProps {
  users: any[];
  loading: boolean;
  searchTerm: string;
  onAssignRole?: (userId: string) => void;
  onResendInvite?: (email: string) => void;
}

const UserList: React.FC<UserListProps> = ({ 
  users, 
  loading, 
  searchTerm,
  onAssignRole,
  onResendInvite
}) => {
  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (user.first_name && user.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>
          {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingState />
        ) : filteredUsers.length > 0 ? (
          <div className="grid gap-4">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onAssignRole={onAssignRole}
                onResendInvite={onResendInvite}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </CardContent>
    </Card>
  );
};

export default UserList;
