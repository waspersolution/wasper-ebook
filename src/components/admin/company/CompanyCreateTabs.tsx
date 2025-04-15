
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BasicInfoTab from '@/components/companies/form/BasicInfoTab';
import AccountingSetupTab from '@/components/companies/form/AccountingSetupTab';
import AdminUserTab from '@/components/companies/form/AdminUserTab';
import { CompanyFormValues } from '@/components/companies/types';

interface CompanyCreateTabsProps {
  form: UseFormReturn<CompanyFormValues>;
  logo: string | null;
  handleLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CompanyCreateTabs: React.FC<CompanyCreateTabsProps> = ({
  form,
  logo,
  handleLogoChange,
}) => {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="basic">Basic Information</TabsTrigger>
        <TabsTrigger value="accounting">Accounting Setup</TabsTrigger>
        <TabsTrigger value="admin">Admin User</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic" className="space-y-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Company Details</CardTitle>
            <CardDescription>
              Enter the basic information about the company
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <BasicInfoTab form={form} logo={logo} handleLogoChange={handleLogoChange} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="accounting" className="space-y-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Accounting Configuration</CardTitle>
            <CardDescription>
              Set up fiscal year and accounting preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <AccountingSetupTab form={form} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="admin" className="space-y-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Company Administrator</CardTitle>
            <CardDescription>
              Designate the main administrator for this company
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminUserTab form={form} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default CompanyCreateTabs;
