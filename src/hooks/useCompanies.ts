
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
      console.log('🏢 useCompanies: Starting fresh fetch after RLS policy update...');
      
      try {
        // First, let's verify we can access branches directly
        console.log('🔍 Testing direct branches access...');
        const { data: testBranches, error: testError } = await supabase
          .from('branches')
          .select('*')
          .limit(3);

        if (testError) {
          console.error('🔍 Direct branches test failed:', testError);
        } else {
          console.log('🔍 Direct branches test successful:', testBranches?.length || 0, 'branches found');
        }

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

        // Now fetch all branches
        const { data: branchesData, error: branchesError } = await supabase
          .from('branches')
          .select('*')
          .order('name');

        if (branchesError) {
          console.error('🏢 useCompanies: Error fetching branches (after RLS fix):', branchesError);
          // Continue without branches instead of throwing
          return companiesData.map(company => ({
            ...company,
            branches: []
          }));
        }

        console.log('🏢 useCompanies: Branches fetched successfully:', branchesData?.length || 0);

        // Debug: Show which branches belong to which companies
        if (branchesData && branchesData.length > 0) {
          const branchMapping = branchesData.reduce((acc, branch) => {
            acc[branch.company_id] = (acc[branch.company_id] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          console.log('🔍 Branch distribution by company:', branchMapping);
        }

        // Combine companies with their branches
        const companiesWithBranches = companiesData.map(company => ({
          ...company,
          branches: branchesData?.filter(branch => branch.company_id === company.id) || []
        }));

        console.log('🏢 useCompanies: Final result after RLS fix:', {
          companiesCount: companiesWithBranches.length,
          totalBranches: companiesWithBranches.reduce((sum, c) => sum + c.branches.length, 0),
          companiesWithBranches: companiesWithBranches.map(c => ({
            name: c.name,
            branchCount: c.branches.length,
            sampleBranches: c.branches.slice(0, 2).map(b => b.name)
          }))
        });

        return companiesWithBranches;
      } catch (error) {
        console.error('🏢 useCompanies: Fatal error after RLS fix:', error);
        throw error;
      }
    },
    staleTime: 0, // Force fresh fetch
    gcTime: 0, // Don't cache after RLS update
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
