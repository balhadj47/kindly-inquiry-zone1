
import { useState, useEffect, useCallback, useRef } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface UseOptimizedDataOptions {
  cacheTime?: number;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
  enabled?: boolean;
}

const cache = new Map<string, CacheEntry<any>>();

export const useOptimizedData = <T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: UseOptimizedDataOptions = {}
) => {
  const {
    cacheTime = 5 * 60 * 1000, // 5 minutes
    staleTime = 30 * 1000, // 30 seconds
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
    const cached = cache.get(key);
    if (cached && Date.now() < cached.expiresAt) {
      return cached;
    }
    return null;
  }, [key]);

  const setCachedData = useCallback((newData: T) => {
    const now = Date.now();
    cache.set(key, {
      data: newData,
      timestamp: now,
      expiresAt: now + cacheTime
    });
  }, [key, cacheTime]);

  const fetchData = useCallback(async (force = false) => {
    if (!enabled) return;

    // Check cache first
    const cached = getCachedData();
    const now = Date.now();
    
    if (!force && cached && (now - cached.timestamp) < staleTime) {
      if (!data) {
        setData(cached.data);
        setLastFetch(cached.timestamp);
      }
      return cached.data;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setError(null);

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
  }, [enabled, getCachedData, staleTime, data, fetchFn, setCachedData]);

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
      const cached = getCachedData();
      if (!cached || (Date.now() - cached.timestamp) > staleTime) {
        fetchData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetchOnWindowFocus, getCachedData, staleTime, fetchData]);

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
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
};
