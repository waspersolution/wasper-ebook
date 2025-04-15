
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface ContextSwitchDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  switchType: 'company' | 'branch';
  onConfirm: () => void;
  isLoading?: boolean;
}

const ContextSwitchDialog: React.FC<ContextSwitchDialogProps> = ({
  isOpen,
  onOpenChange,
  switchType,
  onConfirm,
  isLoading = false
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Switch {switchType === 'company' ? 'Company' : 'Branch'}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will close your current working context. Any unsaved changes may be lost. 
            Are you sure you want to switch to a different {switchType === 'company' ? 'company' : 'branch'}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? 'Switching...' : 'Confirm Switch'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ContextSwitchDialog;
