
import { useQuery } from '@tanstack/react-query';
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

// Hook for fetching branches of a specific company
export const useCompanyBranches = (companyId: string | null) => {
  return useQuery({
    queryKey: ['branches', 'company', companyId],
    queryFn: async (): Promise<Branch[]> => {
      if (!companyId) return [];
      
      console.log('🌿 useCompanyBranches: Fetching branches for company:', companyId);
      const startTime = performance.now();
      
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('company_id', companyId)
        .order('name');

      if (error) {
        console.error('🌿 useCompanyBranches: Error:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log('🌿 useCompanyBranches: Fetched in:', endTime - startTime, 'ms');
      
      return data || [];
    },
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for fetching a single branch
export const useBranch = (branchId: string | null) => {
  return useQuery({
    queryKey: ['branches', branchId],
    queryFn: async (): Promise<Branch | null> => {
      if (!branchId) return null;
      
      console.log('🌿 useBranch: Fetching branch:', branchId);
      const startTime = performance.now();
      
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('id', branchId)
        .single();

      if (error) {
        console.error('🌿 useBranch: Error:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log('🌿 useBranch: Fetched in:', endTime - startTime, 'ms');
      
      return data;
    },
    enabled: !!branchId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
