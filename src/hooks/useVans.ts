
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
  insurer?: string;
  insurance_date?: string;
  control_date?: string;
  notes?: string;
}

// Global cache to prevent multiple fetches
let globalVansCache: { data: Van[]; timestamp: number } | null = null;
let globalFetchPromise: Promise<Van[]> | null = null;
const CACHE_DURATION = 60000; // 1 minute cache

export const useVans = () => {
  const [vans, setVans] = useState<Van[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);

  const fetchVans = useCallback(async (useCache = true): Promise<Van[]> => {
    try {
      console.log('🚐 useVans: Starting to fetch vans data...');
      const startTime = performance.now();
      
      // Check global cache first
      if (useCache && globalVansCache) {
        const { data, timestamp } = globalVansCache;
        const isValid = Date.now() - timestamp < CACHE_DURATION;
        
        if (isValid) {
          console.log('🚐 useVans: Using global cached data');
          if (isMountedRef.current) {
            setVans(data);
            setError(null);
            setIsLoading(false);
          }
          return data;
        }
      }

      // Set loading state
      if (isMountedRef.current) {
        setIsLoading(true);
      }

      // If there's already a fetch in progress, wait for it
      if (globalFetchPromise) {
        console.log('🚐 useVans: Waiting for existing fetch...');
        const data = await globalFetchPromise;
        if (isMountedRef.current) {
          setVans(data);
          setError(null);
          setIsLoading(false);
        }
        return data;
      }

      // Start new fetch
      globalFetchPromise = (async () => {
        const { data, error } = await (supabase as any)
          .from('vans')
          .select('*');

        if (error) {
          console.error('🚐 useVans: Supabase error:', error);
          throw error;
        }

        const vansData = data || [];
        
        // Update global cache
        globalVansCache = {
          data: vansData,
          timestamp: Date.now()
        };

        console.log('🚐 useVans: Successfully fetched vans data in:', performance.now() - startTime, 'ms');
        return vansData;
      })();

      const data = await globalFetchPromise;
      
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setVans(data);
        setError(null);
        setIsLoading(false);
      }

      return data;
    } catch (err) {
      console.error('🚐 useVans: Error fetching vans:', err);
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setIsLoading(false);
      }
      throw err;
    } finally {
      globalFetchPromise = null;
    }
  }, []);

  // Force refresh without cache
  const refetch = useCallback(() => {
    console.log('🚐 useVans: Force refreshing data...');
    globalVansCache = null;
    return fetchVans(false);
  }, [fetchVans]);

  useEffect(() => {
    console.log('🚐 useVans: useEffect triggered - component mounted');
    isMountedRef.current = true;
    
    // Check if we already have cached data
    if (globalVansCache && Date.now() - globalVansCache.timestamp < CACHE_DURATION) {
      console.log('🚐 useVans: Using existing cache on mount');
      setVans(globalVansCache.data);
      setError(null);
      setIsLoading(false);
    } else {
      fetchVans();
    }
    
    return () => {
      console.log('🚐 useVans: Cleanup - component unmounting');
      isMountedRef.current = false;
    };
  }, []); // Remove fetchVans from dependencies to prevent re-runs

  return { vans, error, refetch, isLoading };
};
