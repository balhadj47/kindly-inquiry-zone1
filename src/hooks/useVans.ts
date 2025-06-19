
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

// Simple cache management without complex global state
const CACHE_DURATION = 1000; // 1 second - very short for immediate updates

export const useVans = () => {
  const [vans, setVans] = useState<Van[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);
  const cacheRef = useRef<{ data: Van[], timestamp: number } | null>(null);
  const fetchingRef = useRef(false);

  const clearAllCaches = useCallback(() => {
    // Clear internal cache
    cacheRef.current = null;
    
    // Clear global caches
    if (typeof window !== 'undefined') {
      (window as any).globalVansCache = null;
      (window as any).globalFetchPromise = null;
    }
    
    console.log('🗑️ All caches cleared');
  }, []);

  const fetchVans = useCallback(async (forceRefresh = false): Promise<Van[]> => {
    try {
      const startTime = performance.now();
      
      // Always clear everything on force refresh
      if (forceRefresh) {
        console.log('🚐 useVans: Force refresh - clearing all caches');
        clearAllCaches();
        fetchingRef.current = false;
      }

      // Prevent multiple simultaneous fetches
      if (fetchingRef.current && !forceRefresh) {
        console.log('🚐 useVans: Fetch already in progress');
        return vans;
      }

      // Check cache only if not force refresh
      if (!forceRefresh && cacheRef.current) {
        const { data, timestamp } = cacheRef.current;
        const isValid = Date.now() - timestamp < CACHE_DURATION;
        
        if (isValid) {
          console.log('🚐 useVans: Using cached data');
          return data;
        }
      }

      // Set loading and fetching states
      fetchingRef.current = true;
      if (isMountedRef.current) {
        setIsLoading(true);
        setError(null);
      }

      console.log('🚐 useVans: Fetching fresh data from database...');
      const { data, error } = await supabase
        .from('vans')
        .select('*')
        .order('license_plate');

      if (error) {
        console.error('🚐 useVans: Database error:', error);
        throw error;
      }

      const vansData = data || [];
      const endTime = performance.now();
      console.log('🚐 useVans: Fresh fetch completed -', vansData.length, 'vans in', endTime - startTime, 'ms');
      
      // Update cache
      cacheRef.current = {
        data: vansData,
        timestamp: Date.now()
      };

      // Update state
      if (isMountedRef.current) {
        setVans(vansData);
        setError(null);
        setIsLoading(false);
      }
      
      return vansData;
    } catch (err) {
      console.error('🚐 useVans: Error:', err);
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setIsLoading(false);
      }
      throw err;
    } finally {
      fetchingRef.current = false;
    }
  }, [vans, clearAllCaches]);

  // Force refresh function - always gets fresh data
  const refetch = useCallback(async () => {
    console.log('🚐 useVans: Manual refetch requested');
    return await fetchVans(true);
  }, [fetchVans]);

  useEffect(() => {
    console.log('🚐 useVans: Component mounted');
    isMountedRef.current = true;
    
    // On mount, always fetch fresh data
    fetchVans(true);
    
    return () => {
      console.log('🚐 useVans: Component unmounting');
      isMountedRef.current = false;
    };
  }, [fetchVans]);

  return { vans, error, refetch, isLoading };
};
