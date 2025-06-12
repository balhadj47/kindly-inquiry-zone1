
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Branch {
  id: string;
  name: string;
  company_id: string;
  created_at: string;
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
  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<{ data: Company[]; timestamp: number } | null>(null);
  const isMountedRef = useRef(true);
  const CACHE_DURATION = 30000; // 30 seconds cache

  const fetchCompanies = useCallback(async (useCache = true) => {
    try {
      console.log('🏢 useCompanies: Starting to fetch companies data...');
      const startTime = performance.now();
      
      // Check cache first
      if (useCache && cacheRef.current) {
        const { data, timestamp } = cacheRef.current;
        const isValid = Date.now() - timestamp < CACHE_DURATION;
        
        if (isValid) {
          console.log('🏢 useCompanies: Using cached data');
          if (isMountedRef.current) {
            setCompanies(data);
          }
          return;
        }
      }

      const { data, error } = await (supabase as any)
        .from('companies')
        .select(`
          *,
          branches (
            id,
            name,
            company_id,
            created_at
          )
        `);

      if (error) {
        console.error('🏢 useCompanies: Supabase error:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log('🏢 useCompanies: Successfully fetched companies data in:', endTime - startTime, 'ms');
      
      // Update cache
      cacheRef.current = {
        data: data || [],
        timestamp: Date.now()
      };
      
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setCompanies(data || []);
        setError(null);
      }
    } catch (err) {
      console.error('🏢 useCompanies: Error fetching companies:', err);
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    }
  }, []);

  // Force refresh without cache
  const refetch = useCallback(() => {
    console.log('🏢 useCompanies: Force refreshing data...');
    return fetchCompanies(false);
  }, [fetchCompanies]);

  useEffect(() => {
    console.log('🏢 useCompanies: useEffect triggered - component mounted or fetchCompanies changed');
    isMountedRef.current = true;
    fetchCompanies();
    
    return () => {
      console.log('🏢 useCompanies: Cleanup - component unmounting');
      isMountedRef.current = false;
    };
  }, [fetchCompanies]);

  return { companies, error, refetch, setCompanies };
};
