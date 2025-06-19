
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

// Reduced cache duration for faster updates
const CACHE_DURATION = 5000; // 5 seconds instead of 30

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

const clearCacheFromWindow = () => {
  if (typeof window !== 'undefined') {
    (window as any).globalVansCache = null;
    (window as any).globalFetchPromise = null;
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

export const useVans = () => {
  const [vans, setVans] = useState<Van[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
      const startTime = performance.now();
      
      // Check if we should use cache
      if (!forceRefresh) {
        const globalVansCache = getCacheFromWindow();
        if (globalVansCache) {
          const { data, timestamp } = globalVansCache;
          const isValid = Date.now() - timestamp < CACHE_DURATION;
          
          if (isValid) {
            console.log('🚐 useVans: Using cached data (valid for', (CACHE_DURATION - (Date.now() - timestamp)) / 1000, 'more seconds)');
            updateVansData(data);
            return data;
          }
        }
      }

      // Clear cache if force refresh
      if (forceRefresh) {
        console.log('🚐 useVans: Force refresh - clearing cache');
        clearCacheFromWindow();
      }

      // Prevent rapid duplicate fetches
      const now = Date.now();
      if (!forceRefresh && (now - lastFetchRef.current) < 1000) {
        console.log('🚐 useVans: Rate limiting fetch');
        const cachedData = getCacheFromWindow()?.data;
        if (cachedData) return cachedData;
      }
      lastFetchRef.current = now;

      // Check for existing fetch promise
      const existingPromise = getFetchPromiseFromWindow();
      if (existingPromise && !forceRefresh) {
        console.log('🚐 useVans: Waiting for existing fetch');
        const data = await existingPromise;
        updateVansData(data);
        return data;
      }

      // Set loading state
      if (isMountedRef.current) {
        setIsLoading(true);
      }

      // Start fresh fetch
      const fetchPromise = (async () => {
        console.log('🚐 useVans: Fetching from database...');
        const { data, error } = await (supabase as any)
          .from('vans')
          .select('*')
          .order('license_plate');

        if (error) {
          console.error('🚐 useVans: Database error:', error);
          throw error;
        }

        const vansData = data || [];
        const endTime = performance.now();
        console.log('🚐 useVans: Fetched', vansData.length, 'vans in', endTime - startTime, 'ms');
        
        return vansData;
      })();

      setFetchPromiseToWindow(fetchPromise);
      
      const data = await fetchPromise;
      updateVansData(data);
      
      return data;
    } catch (err) {
      console.error('🚐 useVans: Error:', err);
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setIsLoading(false);
      }
      throw err;
    } finally {
      setFetchPromiseToWindow(null);
    }
  }, [updateVansData]);

  // Force refresh function
  const refetch = useCallback(async () => {
    console.log('🚐 useVans: Manual refetch requested');
    return await fetchVans(true);
  }, [fetchVans]);

  useEffect(() => {
    console.log('🚐 useVans: Component mounted, checking cache...');
    isMountedRef.current = true;
    
    // Always try to fetch fresh data on mount, but use cache if very recent
    fetchVans(false);
    
    return () => {
      console.log('🚐 useVans: Component unmounting');
      isMountedRef.current = false;
    };
  }, [fetchVans]);

  return { vans, error, refetch, isLoading };
};
