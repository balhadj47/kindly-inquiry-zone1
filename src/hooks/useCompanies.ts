
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Branch {
  id: string;
  name: string;
  company_id: string;
  created_at: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface Company {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  created_at: string;
  branches: Branch[];
}

export const useCompanies = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: async (): Promise<Company[]> => {
      console.log('🏢 useCompanies: Fetching companies with branches...');
      
      try {
        // Fetch companies
        const { data: companiesData, error: companiesError } = await supabase
          .from('companies')
          .select('*')
          .order('name');

        if (companiesError) {
          console.error('🏢 useCompanies: Error fetching companies:', companiesError);
          throw companiesError;
        }

        console.log('🏢 useCompanies: Companies fetched:', companiesData?.length || 0);

        if (!companiesData || companiesData.length === 0) {
          console.log('🏢 useCompanies: No companies found');
          return [];
        }

        // Fetch all branches
        const { data: branchesData, error: branchesError } = await supabase
          .from('branches')
          .select('*')
          .order('name');

        if (branchesError) {
          console.error('🏢 useCompanies: Error fetching branches:', branchesError);
          // Continue without branches instead of throwing
          return companiesData.map(company => ({
            ...company,
            branches: []
          }));
        }

        console.log('🏢 useCompanies: Branches fetched successfully:', branchesData?.length || 0);

        // Combine companies with their branches
        const companiesWithBranches = companiesData.map(company => ({
          ...company,
          branches: branchesData?.filter(branch => branch.company_id === company.id) || []
        }));

        console.log('🏢 useCompanies: Final result:', {
          companiesCount: companiesWithBranches.length,
          totalBranches: companiesWithBranches.reduce((sum, c) => sum + c.branches.length, 0)
        });

        return companiesWithBranches;
      } catch (error) {
        console.error('🏢 useCompanies: Fatal error:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: 1000,
  });
};

export const useCompanyMutations = () => {
  const queryClient = useQueryClient();

  const invalidateCompanies = () => {
    queryClient.invalidateQueries({ queryKey: ['companies'] });
  };

  return {
    invalidateCompanies,
  };
};
