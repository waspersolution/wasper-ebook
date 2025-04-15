
import { useToast } from '@/hooks/use-toast';
import { supabaseAdmin } from '@/integrations/supabase/client';
import { InviteFormValues } from '@/components/user/invite-form/UserInviteSchema';

export const useUserInvite = () => {
  const { toast } = useToast();

  const inviteUser = async (values: InviteFormValues): Promise<boolean> => {
    try {
      console.log('Inviting user with details:', values);
      
      const { data: existingUser, error: existingUserError } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', values.email)
        .maybeSingle();

      if (existingUserError && existingUserError.code !== 'PGRST116') {
        console.error('Error checking existing user:', existingUserError);
        throw existingUserError;
      }

      if (existingUser) {
        toast({
          title: 'User already exists',
          description: `The email ${values.email} is already registered.`,
          variant: 'destructive',
        });
        return false;
      }

      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: values.email,
        password: Math.random().toString(36).slice(-8),
        email_confirm: true,
        user_metadata: {
          first_name: values.firstName,
          last_name: values.lastName
        }
      });

      if (authError) {
        console.error("Auth creation error:", authError);
        if (authError.message.includes('not allowed')) {
          toast({
            title: 'Admin Access Required',
            description: 'Please ensure your account has admin privileges to create users.',
            variant: 'destructive',
          });
          return false;
        }
        throw authError;
      }
      
      if (!authData.user) {
        throw new Error('Failed to create user');
      }

      const { error: companyError } = await supabaseAdmin
        .from('user_companies')
        .insert({
          user_id: authData.user.id,
          company_id: values.companyId,
          role: values.role
        });

      if (companyError) {
        console.error('Error associating user with company:', companyError);
        throw companyError;
      }

      if (values.branchIds && values.branchIds.length > 0) {
        const branchAssignments = values.branchIds.map(branchId => ({
          user_id: authData.user.id,
          branch_id: branchId
        }));

        const { error: branchError } = await supabaseAdmin
          .from('user_branches')
          .insert(branchAssignments);

        if (branchError) {
          console.error('Error associating user with branches:', branchError);
          throw branchError;
        }
      }
      
      toast({
        title: 'User created successfully',
        description: `${values.email} has been added to the system.`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Error in user creation process:', error);
      toast({
        title: 'Error adding user',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  return { inviteUser };
};
