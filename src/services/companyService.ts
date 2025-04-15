
import { supabase } from '@/integrations/supabase/client';
import { Company, Branch } from '@/types/company';

export async function fetchUserCompanies(userId: string) {
  const { data, error } = await supabase
    .from('user_companies')
    .select(`
      company_id,
      role,
      is_default,
      companies (
        id,
        name,
        financial_year_start,
        book_start_date,
        has_branches
      )
    `)
    .eq('user_id', userId);

  if (error) throw error;

  return data?.map(item => ({
    ...item.companies,
    isDefault: item.is_default,
    role: item.role
  })) || [];
}

export async function fetchCompanyBranches(companyId: string, userId: string) {
  // Fetch branches for the selected company
  const { data: branchData, error: branchError } = await supabase
    .from('branches')
    .select('id, name, address, is_main_branch')
    .eq('company_id', companyId);
  
  if (branchError) throw branchError;
  
  // Also fetch user_branches to see which branches the user has access to
  const { data: userBranches, error: userBranchError } = await supabase
    .from('user_branches')
    .select('branch_id')
    .eq('user_id', userId);
  
  if (userBranchError) throw userBranchError;
  
  let userBranchIds: string[] = [];
  if (userBranches && userBranches.length > 0) {
    userBranchIds = userBranches.map(ub => ub.branch_id);
  }
  
  if (branchData && branchData.length > 0) {
    // If user_branches has entries, filter branches by those the user has access to
    let filteredBranches = branchData;
    if (userBranchIds.length > 0) {
      filteredBranches = branchData.filter(branch => 
        userBranchIds.includes(branch.id)
      );
    }
    
    return filteredBranches;
  } 
  
  // If no branches, return a default branch
  return [{
    id: "default",
    name: "Main Branch",
    address: null,
    is_main_branch: true
  }];
}

export async function setCompanyAsDefault(userId: string, companyId: string) {
  return await supabase
    .from('user_companies')
    .update({ is_default: true })
    .eq('user_id', userId)
    .eq('company_id', companyId);
}
