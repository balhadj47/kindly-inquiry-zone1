
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

// Global cache - moved to window to make it clearable
const getCacheFromWindow = () => {
  if (typeof window !== 'undefined') {
    return (window as any).globalVansCache || null;
  }
  return null;
};

const setCacheToWindow = (cache: any) => {
  if (typeof window !== 'undefined') {
    (window as any).globalVansCache = cache;
  }
};

const getFetchPromiseFromWindow = () => {
  if (typeof window !== 'undefined') {
    return (window as any).globalFetchPromise || null;
  }
  return null;
};

const setFetchPromiseToWindow = (promise: any) => {
  if (typeof window !== 'undefined') {
    (window as any).globalFetchPromise = promise;
  }
};

const CACHE_DURATION = 30000; // Reduced to 30 seconds for more frequent updates

export const useVans = () => {
  const [vans, setVans] = useState<Van[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(() => {
    // Only start with loading true if we don't have valid cached data
    const globalVansCache = getCacheFromWindow();
    if (globalVansCache && Date.now() - globalVansCache.timestamp < CACHE_DURATION) {
      return false;
    }
    return true;
  });
  const isMountedRef = useRef(true);

  const fetchVans = useCallback(async (useCache = true): Promise<Van[]> => {
    try {
      console.log('🚐 useVans: Starting to fetch vans data...', { useCache });
      const startTime = performance.now();
      
      // Check global cache first
      if (useCache) {
        const globalVansCache = getCacheFromWindow();
        if (globalVansCache) {
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
          } else {
            console.log('🚐 useVans: Cache expired, clearing...');
            setCacheToWindow(null);
          }
        }
      }

      // Set loading state
      if (isMountedRef.current) {
        setIsLoading(true);
      }

      // If there's already a fetch in progress, wait for it
      const globalFetchPromise = getFetchPromiseFromWindow();
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
      const fetchPromise = (async () => {
        console.log('🚐 useVans: Making fresh database call...');
        const { data, error } = await (supabase as any)
          .from('vans')
          .select('*');

        if (error) {
          console.error('🚐 useVans: Supabase error:', error);
          throw error;
        }

        const vansData = data || [];
        
        // Update global cache
        setCacheToWindow({
          data: vansData,
          timestamp: Date.now()
        });

        console.log('🚐 useVans: Successfully fetched fresh vans data in:', performance.now() - startTime, 'ms');
        return vansData;
      })();

      setFetchPromiseToWindow(fetchPromise);
      
      const data = await fetchPromise;
      
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
      setFetchPromiseToWindow(null);
    }
  }, []);

  // Force refresh without cache
  const refetch = useCallback(() => {
    console.log('🚐 useVans: Force refreshing data (clearing cache)...');
    setCacheToWindow(null);
    setFetchPromiseToWindow(null);
    return fetchVans(false);
  }, [fetchVans]);

  useEffect(() => {
    console.log('🚐 useVans: useEffect triggered - component mounted');
    isMountedRef.current = true;
    
    // Check if we already have cached data
    const globalVansCache = getCacheFromWindow();
    if (globalVansCache && Date.now() - globalVansCache.timestamp < CACHE_DURATION) {
      console.log('🚐 useVans: Using existing cache on mount');
      setVans(globalVansCache.data);
      setError(null);
      setIsLoading(false);
    } else {
      console.log('🚐 useVans: No valid cache, fetching fresh data');
      fetchVans(false); // Always fetch fresh data on mount
    }
    
    return () => {
      console.log('🚐 useVans: Cleanup - component unmounting');
      isMountedRef.current = false;
    };
  }, []); // Remove fetchVans from dependencies to prevent re-runs

  return { vans, error, refetch, isLoading };
};
