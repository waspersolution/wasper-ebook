
import { useToast } from '@/hooks/use-toast';
import { supabaseAdmin } from '@/integrations/supabase/client';

export const useUserDelete = () => {
  const { toast } = useToast();

  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      console.log("Deleting user with ID:", userId);
      
      // Delete the user using Supabase Admin API
      const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
      
      if (error) {
        console.error("Error deleting user:", error);
        throw error;
      }
      
      toast({
        title: 'User deleted',
        description: 'The user has been successfully deleted from the system.',
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error deleting user',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  return { deleteUser };
};
