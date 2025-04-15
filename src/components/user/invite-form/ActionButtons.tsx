
import React from 'react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  onCancel: () => void;
  isSubmitting: boolean;
}

export const ActionButtons = ({ onCancel, isSubmitting }: ActionButtonsProps) => {
  return (
    <div className="flex justify-end gap-3 pt-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Invitation'}
      </Button>
    </div>
  );
};
