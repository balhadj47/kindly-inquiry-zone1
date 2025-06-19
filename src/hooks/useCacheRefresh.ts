
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useCacheRefresh = () => {
  const queryClient = useQueryClient();

  const refreshPage = useCallback(async (queryKeys: string[]) => {
    console.log('🔄 Refreshing cache for keys:', queryKeys);
    
    try {
      // Instead of clearing, invalidate and refetch to update data
      const promises = queryKeys.map(async (key) => {
        console.log(`🔄 Invalidating and refetching: ${key}`);
        
        // Invalidate to mark as stale
        await queryClient.invalidateQueries({ queryKey: [key] });
        
        // Force refetch to get fresh data
        await queryClient.refetchQueries({ 
          queryKey: [key],
          type: 'active' 
        });
      });
      
      await Promise.all(promises);
      console.log('✅ Cache refresh completed for keys:', queryKeys);
      
    } catch (error) {
      console.error('❌ Cache refresh failed:', error);
    }
    
    // Also clear any global caches to ensure fresh data
    if (typeof window !== 'undefined') {
      if (queryKeys.includes('vans')) {
        (window as any).globalVansCache = null;
        (window as any).globalFetchPromise = null;
      }
    }
  }, [queryClient]);

  const refreshAll = useCallback(async () => {
    console.log('🔄 Refreshing all cache');
    try {
      // Invalidate all queries and refetch
      await queryClient.invalidateQueries();
      await queryClient.refetchQueries({ type: 'active' });
      
      // Clear global caches
      if (typeof window !== 'undefined') {
        (window as any).globalVansCache = null;
        (window as any).globalFetchPromise = null;
      }
      
      console.log('✅ All cache refresh completed');
    } catch (error) {
      console.error('❌ All cache refresh failed:', error);
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
