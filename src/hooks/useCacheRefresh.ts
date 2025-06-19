
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useCacheRefresh = () => {
  const queryClient = useQueryClient();

  const refreshPage = useCallback((queryKeys: string[]) => {
    console.log('🔄 Refreshing cache for keys:', queryKeys);
    
    // Clear specific caches and refetch immediately
    queryKeys.forEach(key => {
      // Remove cached data completely
      queryClient.removeQueries({ queryKey: [key] });
      // Invalidate to trigger refetch
      queryClient.invalidateQueries({ queryKey: [key] });
    });
    
    // Also clear any global caches
    if (typeof window !== 'undefined') {
      // Clear any global van cache
      if (queryKeys.includes('vans')) {
        (window as any).globalVansCache = null;
        (window as any).globalFetchPromise = null;
      }
    }
  }, [queryClient]);

  const refreshAll = useCallback(() => {
    console.log('🔄 Refreshing all cache');
    // Clear all cache and refetch
    queryClient.clear();
    queryClient.invalidateQueries();
    
    // Clear global caches
    if (typeof window !== 'undefined') {
      (window as any).globalVansCache = null;
      (window as any).globalFetchPromise = null;
    }
  }, [queryClient]);

  const clearCache = useCallback(() => {
    console.log('🗑️ Clearing all cache');
    // Remove all cached data
    queryClient.clear();
    
    // Clear global caches
    if (typeof window !== 'undefined') {
      (window as any).globalVansCache = null;
      (window as any).globalFetchPromise = null;
    }
  }, [queryClient]);

  return {
    refreshPage,
    refreshAll,
    clearCache,
  };
};
