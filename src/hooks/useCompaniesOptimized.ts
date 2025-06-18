
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CompanyBase {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  created_at: string;
}

export interface CompanyWithBranches extends CompanyBase {
  branches: Array<{
    id: string;
    name: string;
    company_id: string;
    created_at: string;
    address?: string;
    phone?: string;
    email?: string;
  }>;
}

// Cache keys
export const COMPANIES_QUERY_KEY = ['companies'];
export const COMPANY_WITH_BRANCHES_QUERY_KEY = (companyId: string) => ['companies', companyId, 'branches'];

// Optimized hook for basic company data (no branches)
export const useCompaniesBase = () => {
  return useQuery({
    queryKey: COMPANIES_QUERY_KEY,
    queryFn: async (): Promise<CompanyBase[]> => {
      console.log('🏢 useCompaniesBase: Fetching companies without branches...');
      const startTime = performance.now();
      
      const { data, error } = await supabase
        .from('companies')
        .select('id, name, address, phone, email, created_at')
        .order('name');

      if (error) {
        console.error('🏢 useCompaniesBase: Error:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log('🏢 useCompaniesBase: Fetched in:', endTime - startTime, 'ms');
      
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for a single company with its branches (lazy loaded)
export const useCompanyWithBranches = (companyId: string | null) => {
  return useQuery({
    queryKey: COMPANY_WITH_BRANCHES_QUERY_KEY(companyId || ''),
    queryFn: async (): Promise<CompanyWithBranches | null> => {
      if (!companyId) return null;
      
      console.log('🏢 useCompanyWithBranches: Fetching company with branches for:', companyId);
      const startTime = performance.now();
      
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          branches (
            id,
            name,
            company_id,
            created_at,
            address,
            phone,
            email
          )
        `)
        .eq('id', companyId)
        .single();

      if (error) {
        console.error('🏢 useCompanyWithBranches: Error:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log('🏢 useCompanyWithBranches: Fetched in:', endTime - startTime, 'ms');
      
      return data;
    },
    enabled: !!companyId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for all companies with branches (when needed)
export const useAllCompaniesWithBranches = () => {
  return useQuery({
    queryKey: ['companies', 'with-branches'],
    queryFn: async (): Promise<CompanyWithBranches[]> => {
      console.log('🏢 useAllCompaniesWithBranches: Fetching all companies with branches...');
      const startTime = performance.now();
      
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          branches (
            id,
            name,
            company_id,
            created_at,
            address,
            phone,
            email
          )
        `)
        .order('name');

      if (error) {
        console.error('🏢 useAllCompaniesWithBranches: Error:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log('🏢 useAllCompaniesWithBranches: Fetched in:', endTime - startTime, 'ms');
      
      return data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for full data
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Utility hook to invalidate company caches
export const useCompanyMutations = () => {
  const queryClient = useQueryClient();

  const invalidateCompanies = () => {
    queryClient.invalidateQueries({ queryKey: COMPANIES_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: ['companies'] });
  };

  const invalidateCompanyBranches = (companyId: string) => {
    queryClient.invalidateQueries({ queryKey: COMPANY_WITH_BRANCHES_QUERY_KEY(companyId) });
  };

  return {
    invalidateCompanies,
    invalidateCompanyBranches,
  };
};
