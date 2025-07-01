
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DatabaseService } from '@/services/database';

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
        const data = await DatabaseService.getCompanies();
        
        if (!data || data.length === 0) {
          console.log('🏢 useCompanies: No companies found');
          return [];
        }

        // Enhanced logging to debug branch data
        console.log('🏢 useCompanies: Raw data from database:', JSON.stringify(data, null, 2));
        
        const processedData = data.map(company => {
          const branches = company.branches || [];
          console.log(`🏢 Company "${company.name}" has ${branches.length} branches:`, branches);
          
          return {
            ...company,
            branches: branches
          };
        });

        console.log('🏢 useCompanies: Final processed result:', {
          companiesCount: processedData.length,
          totalBranches: processedData.reduce((sum, c) => sum + (c.branches?.length || 0), 0),
          companiesWithBranches: processedData.map(c => ({
            name: c.name,
            branchCount: c.branches?.length || 0,
            branchNames: c.branches?.map(b => b.name) || []
          }))
        });

        return processedData;
      } catch (error) {
        console.error('🏢 useCompanies: Error:', error);
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
