
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InviteFormValues, inviteFormSchema } from '../UserInviteSchema';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export const useInviteForm = (onSubmit: (values: InviteFormValues) => Promise<void>) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      role: '',
      companyId: '',
      branchIds: [],
    },
  });

  const handleSubmit = async (values: InviteFormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Starting user creation process with values:", values);
      await onSubmit(values);
      form.reset();
    } catch (error: any) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: 'Error creating user',
        description: error.message || 'Failed to create user',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
};
