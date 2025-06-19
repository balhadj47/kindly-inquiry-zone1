
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useCacheRefresh = () => {
  const queryClient = useQueryClient();

  const refreshPage = useCallback(async (queryKeys: string[]) => {
    console.log('🔄 Cache refresh for keys:', queryKeys);
    
    try {
      // Clear global caches immediately
      if (typeof window !== 'undefined') {
        if (queryKeys.includes('vans')) {
          (window as any).globalVansCache = null;
          (window as any).globalFetchPromise = null;
          console.log('🔄 Cleared vans global cache');
        }
      }

      // Invalidate and refetch React Query caches
      const promises = queryKeys.map(async (key) => {
        await queryClient.invalidateQueries({ queryKey: [key] });
        await queryClient.refetchQueries({ 
          queryKey: [key],
          type: 'active' 
        });
      });
      
      await Promise.all(promises);
      console.log('✅ Cache refresh completed');
      
    } catch (error) {
      console.error('❌ Cache refresh failed:', error);
    }
  }, [queryClient]);

  const refreshAll = useCallback(async () => {
    console.log('🔄 Refreshing all caches');
    try {
      // Clear all global caches
      if (typeof window !== 'undefined') {
        (window as any).globalVansCache = null;
        (window as any).globalFetchPromise = null;
      }
      
      // Invalidate and refetch all React Query caches
      await queryClient.invalidateQueries();
      await queryClient.refetchQueries({ type: 'active' });
      
      console.log('✅ All cache refresh completed');
    } catch (error) {
      console.error('❌ All cache refresh failed:', error);
    }
  }, [queryClient]);

  const clearCache = useCallback(() => {
    console.log('🗑️ Clearing all caches');
    
    // Clear React Query cache
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
