
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import InviteUserForm from '@/components/user/InviteUserForm';
import { InviteFormValues } from '@/components/user/invite-form/UserInviteSchema';

interface InviteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: InviteFormValues) => Promise<boolean>;
}

const InviteUserDialog = ({ open, onOpenChange, onSubmit }: InviteUserDialogProps) => {
  // Create a wrapper function that converts Promise<boolean> to Promise<void>
  const handleFormSubmit = async (values: InviteFormValues): Promise<void> => {
    const success = await onSubmit(values);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Invite a user to join your organization with specific roles and permissions.
          </DialogDescription>
        </DialogHeader>
        
        <InviteUserForm
          onSubmit={handleFormSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default InviteUserDialog;
