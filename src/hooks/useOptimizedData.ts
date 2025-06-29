
import { useState, useEffect, useCallback, useRef } from 'react';
import { globalCache, CACHE_DURATIONS } from '@/services/cacheManager';

interface UseOptimizedDataOptions {
  cacheTime?: number;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
  enabled?: boolean;
}

export const useOptimizedData = <T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: UseOptimizedDataOptions = {}
) => {
  const {
    cacheTime = CACHE_DURATIONS.STALE_TIME.MEDIUM,
    staleTime = CACHE_DURATIONS.STALE_TIME.SHORT,
    refetchOnWindowFocus = true,
    enabled = true
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  const getCachedData = useCallback(() => {
    return globalCache.get<T>(key);
  }, [key]);

  const setCachedData = useCallback((newData: T) => {
    globalCache.set(key, newData, cacheTime);
  }, [key, cacheTime]);

  const fetchData = useCallback(async (force = false) => {
    if (!enabled) return;

    // Check cache first
    const cached = getCachedData();
    const now = Date.now();
    
    if (!force && cached && globalCache.isValid(key)) {
      if (!data) {
        setData(cached);
        setLastFetch(now);
      }
      return cached;
    }

    // Check for existing fetch promise
    const existingPromise = globalCache.getFetchPromise<T>(key);
    if (existingPromise && !force) {
      return await existingPromise;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setError(null);

    const fetchPromise = (async () => {
      try {
        const result = await fetchFn();
        
        if (isMountedRef.current) {
          setData(result);
          setLastFetch(now);
          setCachedData(result);
          setError(null);
        }
        
        return result;
      } catch (err) {
        if (isMountedRef.current && err.name !== 'AbortError') {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
        throw err;
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    })();

    // Register the promise in global cache
    globalCache.setFetchPromise(key, fetchPromise);

    return await fetchPromise;
  }, [enabled, getCachedData, staleTime, data, fetchFn, setCachedData, key]);

  const refetch = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetchData();
    }
    
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [enabled, key]);

  // Window focus refetch
  useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const handleFocus = () => {
      if (!globalCache.isValid(key)) {
        fetchData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetchOnWindowFocus, key, fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch,
    lastFetch,
    isCached: !!getCachedData(),
    isStale: data ? (Date.now() - lastFetch) > staleTime : false
  };
};

export const clearCache = (key?: string) => {
  globalCache.clear(key);
};
