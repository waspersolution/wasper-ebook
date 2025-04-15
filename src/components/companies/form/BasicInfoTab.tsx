
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';
import { CompanyFormValues } from '../types';

interface BasicInfoTabProps {
  form: UseFormReturn<CompanyFormValues>;
  logo: string | null;
  handleLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ form, logo, handleLogoChange }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-none w-32 h-32">
          <div className="w-full h-full relative border-2 border-dashed rounded-lg flex flex-col items-center justify-center">
            {logo ? (
              <img 
                src={logo} 
                alt="Company logo" 
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-xs text-center mt-1">Upload Logo</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleLogoChange}
            />
          </div>
        </div>
        
        <div className="flex-1">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name *</FormLabel>
                <FormControl>
                  <Input placeholder="ACME Inc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone *</FormLabel>
              <FormControl>
                <Input placeholder="+1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="contact@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="taxId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tax/GST ID</FormLabel>
              <FormControl>
                <Input placeholder="GST123456789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address *</FormLabel>
            <FormControl>
              <Textarea placeholder="123 Business St, City" {...field} className="min-h-[80px]" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BasicInfoTab;
