
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface UserCardProps {
  user: any;
  onAssignRole?: (userId: string) => void;
  onResendInvite?: (email: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onAssignRole, onResendInvite }) => {
  const handleResendInvite = () => {
    if (onResendInvite && user.email) {
      onResendInvite(user.email);
    }
  };
  
  const firstInitial = user.first_name ? user.first_name.charAt(0) : user.email?.charAt(0) || '?';
  
  return (
    <div className="flex items-center justify-between p-3 border rounded-md">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium">
          {firstInitial}
        </div>
        <div>
          <p className="font-medium">
            {user.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Unnamed User'}
          </p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <div className="flex gap-2">
        {onAssignRole && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onAssignRole(user.id)}
          >
            Assign Role
          </Button>
        )}
        {onResendInvite && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleResendInvite}
          >
            Resend Invite
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserCard;
