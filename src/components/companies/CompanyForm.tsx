
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

import BasicInfoTab from './form/BasicInfoTab';
import AccountingSetupTab from './form/AccountingSetupTab';
import AdminUserTab from './form/AdminUserTab';
import { companyFormSchema, CompanyFormValues } from './types';

interface CompanyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompanyCreated: () => void;
}

const CompanyForm: React.FC<CompanyFormProps> = ({
  open,
  onOpenChange,
  onCompanyCreated,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: '',
      financialYearStart: new Date(),
      bookStartDate: new Date(),
      address: '',
      email: '',
      phone: '',
      website: '',
      taxId: '',
      currency: 'USD',
      adminEmail: user?.email || '',
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setLogo(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: CompanyFormValues) => {
    if (!user) {
      toast({
        title: 'Authentication error',
        description: 'You must be logged in to create a company',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create the company
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: values.name,
          address: values.address,
          email: values.email || null,
          phone: values.phone,
          website: values.website || null,
          owner_id: user.id,
          financial_year_start: values.financialYearStart.toISOString(),
          book_start_date: values.bookStartDate.toISOString(),
          tax_id: values.taxId || null,
          currency: values.currency,
          admin_email: values.adminEmail,
          has_branches: true, // Always enable branches
          // Logo will need to be stored in Supabase Storage
          // This would require additional setup with Supabase Storage
        })
        .select()
        .single();

      if (companyError) throw companyError;

      console.log("Created company:", companyData);

      // Create a default Main Branch for the company
      const { data: branchData, error: branchError } = await supabase
        .from('branches')
        .insert({
          company_id: companyData.id,
          name: 'Main Branch',
          address: values.address, // Use the same address as company
          email: values.email || null,
          phone: values.phone,
          is_main_branch: true // Mark as main branch
        })
        .select()
        .single();
        
      if (branchError) throw branchError;
      
      console.log("Created default branch:", branchData);

      // Create user-company association with default role
      const { error: userCompanyError } = await supabase
        .from('user_companies')
        .insert({
          user_id: user.id,
          company_id: companyData.id,
          role: 'admin', // Default role for company creator
          is_default: true // Make this the default company for the user
        });

      if (userCompanyError) throw userCompanyError;
      
      // Add the user to the branch automatically
      const { error: userBranchError } = await supabase
        .from('user_branches')
        .insert({
          user_id: user.id,
          branch_id: branchData.id
        });
        
      if (userBranchError) throw userBranchError;

      toast({
        title: 'Company created',
        description: `${values.name} has been created successfully with a default Main Branch.`,
      });
      
      form.reset();
      onOpenChange(false);
      onCompanyCreated();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create company',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Company</DialogTitle>
          <DialogDescription>
            Set up your company with all required accounting and system information.
            A default Main Branch will be created automatically.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="accounting">Accounting Setup</TabsTrigger>
                <TabsTrigger value="admin">Admin User</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic">
                <BasicInfoTab form={form} logo={logo} handleLogoChange={handleLogoChange} />
              </TabsContent>
              
              <TabsContent value="accounting">
                <AccountingSetupTab form={form} />
              </TabsContent>
              
              <TabsContent value="admin">
                <AdminUserTab form={form} />
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Company'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyForm;
