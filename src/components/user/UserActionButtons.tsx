
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, UserPlus } from 'lucide-react';

interface UserActionButtonsProps {
  onRefresh: () => void;
  onAddUser: () => void;
}

const UserActionButtons = ({ onRefresh, onAddUser }: UserActionButtonsProps) => {
  return (
    <div className="flex gap-2">
      <Button onClick={onRefresh} variant="outline" size="sm">
        <RefreshCw className="mr-2 h-4 w-4" /> Refresh
      </Button>
      <Button size="sm" onClick={onAddUser}>
        <UserPlus className="mr-2 h-4 w-4" /> Add User
      </Button>
    </div>
  );
};

export default UserActionButtons;
