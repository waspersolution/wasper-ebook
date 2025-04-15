
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { companyFormSchema, CompanyFormValues } from '@/components/companies/types';
import CompanyCreateTabs from './CompanyCreateTabs';

interface CompanyCreateFormProps {
  onSuccess?: (values: CompanyFormValues) => void;
}

const CompanyCreateForm: React.FC<CompanyCreateFormProps> = ({ onSuccess }) => {
  const [logo, setLogo] = useState<string | null>(null);
  const { toast } = useToast();
  
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: '',
      financialYearStart: new Date(),
      bookStartDate: new Date(),
      address: '',
      phone: '',
      email: '',
      website: '',
      taxId: '',
      currency: 'USD',
      adminEmail: '',
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
    console.log('Form values:', values);
    // In a real app, this would save the company to your database
    toast({
      title: 'Company created',
      description: `${values.name} has been created successfully.`,
    });
    
    if (onSuccess) {
      onSuccess(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CompanyCreateTabs
          form={form}
          logo={logo}
          handleLogoChange={handleLogoChange}
        />
        
        <div className="flex justify-end">
          <Button type="submit">Create Company</Button>
        </div>
      </form>
    </Form>
  );
};

export default CompanyCreateForm;
