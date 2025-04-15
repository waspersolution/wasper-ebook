
import React from 'react';
import { Form } from '@/components/ui/form';
import { InviteFormValues } from './invite-form/UserInviteSchema';
import { PersonalInfoFields } from './invite-form/PersonalInfoFields';
import { CompanySelect } from './invite-form/CompanySelect';
import { RoleSelect } from './invite-form/RoleSelect';
import { BranchSelection } from './invite-form/BranchSelection';
import { ActionButtons } from './invite-form/ActionButtons';
import { useInviteForm } from './invite-form/hooks/useInviteForm';
import { useInviteFormData } from './invite-form/useInviteFormData';

interface InviteUserFormProps {
  onSubmit: (values: InviteFormValues) => Promise<void>;
  onCancel: () => void;
}

const InviteUserForm = ({ onSubmit, onCancel }: InviteUserFormProps) => {
  const { companies, branches, roles, rolesLoading } = useInviteFormData();
  const { form, isSubmitting, handleSubmit } = useInviteForm(onSubmit);

  const watchCompanyId = form.watch('companyId');

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <PersonalInfoFields form={form} />
        
        <CompanySelect form={form} companies={companies} />
        
        <RoleSelect 
          form={form} 
          roles={roles} 
          loading={rolesLoading} 
          companyId={watchCompanyId} 
        />
        
        <BranchSelection 
          form={form}
          branches={branches}
          companyId={watchCompanyId}
        />
        
        <ActionButtons 
          onCancel={onCancel}
          isSubmitting={isSubmitting}
        />
      </form>
    </Form>
  );
};

export default InviteUserForm;
