
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  companies?: any[];
  created_at: string;
  updated_at: string;
}
