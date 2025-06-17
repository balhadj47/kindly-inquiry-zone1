
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Van {
  id: string;
  license_plate: string;
  model: string;
  reference_code: string;
  driver_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useVans = () => {
  const [vans, setVans] = useState<Van[]>([]);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<{ data: Van[]; timestamp: number } | null>(null);
  const isMountedRef = useRef(true);
  const CACHE_DURATION = 30000; // 30 seconds cache

  const fetchVans = useCallback(async (useCache = true) => {
    try {
      console.log('🚐 useVans: Starting to fetch vans data...');
      const startTime = performance.now();
      
      // Check cache first
      if (useCache && cacheRef.current) {
        const { data, timestamp } = cacheRef.current;
        const isValid = Date.now() - timestamp < CACHE_DURATION;
        
        if (isValid) {
          console.log('🚐 useVans: Using cached data');
          if (isMountedRef.current) {
            setVans(data);
          }
          return;
        }
      }
      
      const { data, error } = await (supabase as any)
        .from('vans')
        .select('*');

      if (error) {
        console.error('🚐 useVans: Supabase error:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log('🚐 useVans: Successfully fetched vans data in:', endTime - startTime, 'ms');
      
      // Update cache
      cacheRef.current = {
        data: data || [],
        timestamp: Date.now()
      };
      
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setVans(data || []);
        setError(null);
      }
    } catch (err) {
      console.error('🚐 useVans: Error fetching vans:', err);
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    }
  }, []);

  // Force refresh without cache
  const refetch = useCallback(() => {
    console.log('🚐 useVans: Force refreshing data...');
    return fetchVans(false);
  }, [fetchVans]);

  useEffect(() => {
    console.log('🚐 useVans: useEffect triggered - component mounted or fetchVans changed');
    isMountedRef.current = true;
    fetchVans();
    
    return () => {
      console.log('🚐 useVans: Cleanup - component unmounting');
      isMountedRef.current = false;
    };
  }, [fetchVans]);

  return { vans, error, refetch };
};
