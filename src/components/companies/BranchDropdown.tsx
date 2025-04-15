
import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Branch {
  id: string;
  name: string;
  address?: string;
  is_main_branch?: boolean;
}

interface BranchDropdownProps {
  companyId: string;
  value?: string;
  onChange?: (value: string) => void;
  onBranchData?: (branch: Branch | null) => void;
  className?: string;
}

export const BranchDropdown: React.FC<BranchDropdownProps> = ({
  companyId,
  value,
  onChange,
  onBranchData,
  className
}) => {
  const [open, setOpen] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBranches = async () => {
      if (!companyId) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('branches')
          .select('id, name, address, is_main_branch')
          .eq('company_id', companyId)
          .order('name');
        
        if (error) throw error;
        
        setBranches(data || []);
        
        // If there's a value and branches are loaded, set the selected branch
        if (value) {
          const branch = data?.find(b => b.id === value) || null;
          setSelectedBranch(branch);
          if (onBranchData) onBranchData(branch);
        } else if (data && data.length > 0) {
          // Set main branch as default, if available
          const mainBranch = data.find(b => b.is_main_branch) || data[0];
          setSelectedBranch(mainBranch);
          if (onChange) onChange(mainBranch.id);
          if (onBranchData) onBranchData(mainBranch);
        }
      } catch (error: any) {
        console.error("Error fetching branches:", error);
        toast({
          title: "Error",
          description: "Failed to fetch branches. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, [companyId, value, onChange, onBranchData, toast]);

  const handleSelect = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId) || null;
    setSelectedBranch(branch);
    if (onChange) onChange(branchId);
    if (onBranchData) onBranchData(branch);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={loading}
          className={cn("justify-between", className)}
        >
          {loading ? (
            "Loading branches..."
          ) : selectedBranch ? (
            <span>{selectedBranch.name} {selectedBranch.is_main_branch ? "(Main)" : ""}</span>
          ) : (
            "Select branch"
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full min-w-[200px]">
        <Command>
          <CommandInput placeholder="Search branch..." />
          <CommandEmpty>No branch found.</CommandEmpty>
          <CommandGroup>
            {branches.map((branch) => (
              <CommandItem
                key={branch.id}
                value={branch.id}
                onSelect={() => handleSelect(branch.id)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedBranch?.id === branch.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {branch.name} {branch.is_main_branch ? "(Main)" : ""}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default BranchDropdown;
