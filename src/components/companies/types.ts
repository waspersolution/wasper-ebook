
import { z } from 'zod';

// Form schema with enhanced fields
export const companyFormSchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  financialYearStart: z.date({
    required_error: "Financial year start is required",
  }),
  bookStartDate: z.date({
    required_error: "Book start date is required",
  }),
  address: z.string().min(1, 'Address is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().min(1, 'Phone number is required'),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  taxId: z.string().optional(),
  currency: z.string().min(1, 'Currency is required'),
  adminEmail: z.string().email('Invalid admin email').min(1, 'Admin email is required'),
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;
