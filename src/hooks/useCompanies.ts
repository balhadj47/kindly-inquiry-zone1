
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  phone?: string;
  email?: string;
}

export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  created_at: string;
  updated_at: string;
  branches: Branch[];
}

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<{ data: Company[]; timestamp: number } | null>(null);
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
          setCompanies(data);
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
            address,
            city,
            phone,
            email
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
      
      setCompanies(data || []);
      setError(null);
    } catch (err) {
      console.error('🏢 useCompanies: Error fetching companies:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }, []);

  // Force refresh without cache
  const refetch = useCallback(() => {
    console.log('🏢 useCompanies: Force refreshing data...');
    return fetchCompanies(false);
  }, [fetchCompanies]);

  useEffect(() => {
    console.log('🏢 useCompanies: useEffect triggered - component mounted or fetchCompanies changed');
    fetchCompanies();
    
    return () => {
      console.log('🏢 useCompanies: Cleanup - component unmounting');
    };
  }, [fetchCompanies]);

  return { companies, error, refetch, setCompanies };
};
