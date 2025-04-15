
import { useToast } from '@/hooks/use-toast';
import { supabaseAdmin } from '@/integrations/supabase/client';
import { User } from '@/types/user';

export const useUserFetch = () => {
  const { toast } = useToast();

  const fetchUsers = async (): Promise<User[]> => {
    try {
      console.log("Fetching all users...");
      
      const { data: profiles, error } = await supabaseAdmin
        .from('profiles')
        .select('*');

      if (error) {
        console.error("Error fetching profiles:", error);
        throw error;
      }
      
      console.log("Fetched profiles:", profiles);

      const usersWithDetails = await Promise.all((profiles || []).map(async (profile) => {
        const { data: userCompanies, error: companyError } = await supabaseAdmin
          .from('user_companies')
          .select('*, companies:company_id(name)')
          .eq('user_id', profile.id);
        
        if (companyError) {
          console.error(`Error fetching companies for user ${profile.id}:`, companyError);
        }
        
        return {
          ...profile,
          companies: userCompanies || []
        };
      }));
      
      console.log("Users with details:", usersWithDetails);
      return usersWithDetails;
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error fetching users',
        description: error.message,
        variant: 'destructive',
      });
      return [];
    }
  };

  return { fetchUsers };
};
