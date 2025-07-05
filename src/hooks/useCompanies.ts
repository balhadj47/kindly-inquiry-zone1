
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

// Optimized query with better caching and error handling
export const useCompanies = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: async (): Promise<Company[]> => {
      console.log('🏢 useCompanies: Fetching companies...');
      const startTime = performance.now();
      
      try {
        const data = await DatabaseService.getCompanies();
        
        if (!data || data.length === 0) {
          console.log('🏢 useCompanies: No companies found');
          return [];
        }

        const processedData = data.map(company => ({
          ...company,
          branches: company.branches || []
        }));

        const endTime = performance.now();
        console.log(`🏢 useCompanies: Fetched ${processedData.length} companies in ${endTime - startTime}ms`);

        return processedData;
      } catch (error) {
        console.error('🏢 useCompanies: Error:', error);
        
        // For permission errors, return empty array instead of throwing
        if (error instanceof Error && 
            (error.message?.includes('permission') || error.message?.includes('Authentication required'))) {
          console.warn('🏢 useCompanies: Permission denied, returning empty array');
          return [];
        }
        
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - reduced for fresher data
    gcTime: 5 * 60 * 1000, // 5 minutes - reduced memory usage
    retry: (failureCount, error) => {
      // Don't retry permission errors
      if (error instanceof Error && 
          (error.message?.includes('permission') || error.message?.includes('Authentication required'))) {
        return false;
      }
      return failureCount < 1; // Reduced retry attempts
    },
    retryDelay: 500, // Faster retry
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    refetchOnMount: true,
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
