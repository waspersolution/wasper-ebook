
import { useToast } from '@/hooks/use-toast';
import { supabaseAdmin } from '@/integrations/supabase/client';

export const useUserResendInvite = () => {
  const { toast } = useToast();

  const resendInvitation = async (email: string): Promise<void> => {
    try {
      console.log("Resending invitation to:", email);
      
      const { data, error } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: email,
      });
      
      if (error) {
        console.error("Error generating magic link:", error);
        throw error;
      }
      
      console.log("Magic link generated successfully:", data);
      
      toast({
        title: 'Invitation resent',
        description: `A new invitation has been sent to ${email}.`,
      });
    } catch (error: any) {
      console.error('Error resending invitation:', error);
      toast({
        title: 'Error resending invitation',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return { resendInvitation };
};
