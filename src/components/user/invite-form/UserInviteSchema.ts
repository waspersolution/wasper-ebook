
import { z } from 'zod';

// Define the schema for user invitation
export const inviteFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.string().min(1, 'Role is required'),
  companyId: z.string().min(1, 'Company is required'),
  branchIds: z.array(z.string()).min(1, 'At least one branch must be selected'),
});

export type InviteFormValues = z.infer<typeof inviteFormSchema>;

export interface Branch {
  id: string;
  name: string;
  company_id: string;
}

export interface Company {
  id: string;
  name: string;
}
