
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

// Global cache management
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

const CACHE_DURATION = 30000; // 30 seconds

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
  const lastFetchRef = useRef<number>(0);

  const updateVansData = useCallback((newData: Van[]) => {
    if (isMountedRef.current) {
      console.log('🚐 useVans: Updating vans data with', newData.length, 'items');
      setVans(newData);
      setError(null);
      setIsLoading(false);
      
      // Update global cache with fresh data
      setCacheToWindow({
        data: newData,
        timestamp: Date.now()
      });
    }
  }, []);

  const fetchVans = useCallback(async (forceRefresh = false): Promise<Van[]> => {
    try {
      console.log('🚐 useVans: Starting to fetch vans data...', { forceRefresh });
      const startTime = performance.now();
      
      // Prevent duplicate rapid fetches
      const now = Date.now();
      if (!forceRefresh && (now - lastFetchRef.current) < 1000) {
        console.log('🚐 useVans: Skipping fetch due to rate limit');
        const globalVansCache = getCacheFromWindow();
        if (globalVansCache?.data) {
          return globalVansCache.data;
        }
      }
      lastFetchRef.current = now;
      
      // Check global cache first (unless forcing refresh)
      if (!forceRefresh) {
        const globalVansCache = getCacheFromWindow();
        if (globalVansCache) {
          const { data, timestamp } = globalVansCache;
          const isValid = Date.now() - timestamp < CACHE_DURATION;
          
          if (isValid) {
            console.log('🚐 useVans: Using global cached data');
            updateVansData(data);
            return data;
          } else {
            console.log('🚐 useVans: Cache expired, fetching fresh data...');
          }
        }
      } else {
        console.log('🚐 useVans: Force refresh requested, clearing cache...');
        setCacheToWindow(null);
      }

      // Set loading state
      if (isMountedRef.current) {
        setIsLoading(true);
      }

      // If there's already a fetch in progress and we're not forcing refresh, wait for it
      const globalFetchPromise = getFetchPromiseFromWindow();
      if (globalFetchPromise && !forceRefresh) {
        console.log('🚐 useVans: Waiting for existing fetch...');
        const data = await globalFetchPromise;
        updateVansData(data);
        return data;
      }

      // Start new fetch
      const fetchPromise = (async () => {
        console.log('🚐 useVans: Making fresh database call...');
        const { data, error } = await (supabase as any)
          .from('vans')
          .select('*')
          .order('license_plate');

        if (error) {
          console.error('🚐 useVans: Supabase error:', error);
          throw error;
        }

        const vansData = data || [];
        console.log('🚐 useVans: Successfully fetched', vansData.length, 'vans in:', performance.now() - startTime, 'ms');
        
        return vansData;
      })();

      setFetchPromiseToWindow(fetchPromise);
      
      const data = await fetchPromise;
      updateVansData(data);

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
  }, [updateVansData]);

  // Force refresh without cache
  const refetch = useCallback(async () => {
    console.log('🚐 useVans: Force refreshing data (clearing cache)...');
    return await fetchVans(true);
  }, [fetchVans]);

  useEffect(() => {
    console.log('🚐 useVans: useEffect triggered - component mounted');
    isMountedRef.current = true;
    
    // Check if we already have cached data
    const globalVansCache = getCacheFromWindow();
    if (globalVansCache && Date.now() - globalVansCache.timestamp < CACHE_DURATION) {
      console.log('🚐 useVans: Using existing cache on mount');
      updateVansData(globalVansCache.data);
    } else {
      console.log('🚐 useVans: No valid cache, fetching fresh data');
      fetchVans(false);
    }
    
    return () => {
      console.log('🚐 useVans: Cleanup - component unmounting');
      isMountedRef.current = false;
    };
  }, [fetchVans, updateVansData]);

  return { vans, error, refetch, isLoading };
};
