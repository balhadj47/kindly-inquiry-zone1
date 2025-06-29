
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { createCacheRefreshManager, globalCache } from '@/services/cacheManager';

export const useCacheRefresh = () => {
  const queryClient = useQueryClient();
  const cacheManager = createCacheRefreshManager(queryClient);

  const refreshPage = useCallback(async (queryKeys: string[]) => {
    console.log('🔄 Cache refresh for keys:', queryKeys);
    
    try {
      // Clear global caches immediately
      if (typeof window !== 'undefined') {
        if (queryKeys.includes('vans')) {
          globalCache.clear('vans');
          (window as any).globalVansCache = null;
          (window as any).globalFetchPromise = null;
          console.log('🔄 Cleared vans global cache');
        }
      }

      // Use centralized cache manager
      await cacheManager.refreshQueries(queryKeys);
      
      console.log('✅ Cache refresh completed');
      
    } catch (error) {
      console.error('❌ Cache refresh failed:', error);
    }
  }, [cacheManager]);

  const refreshAll = useCallback(async () => {
    console.log('🔄 Refreshing all caches');
    try {
      // Use centralized full refresh
      await cacheManager.fullRefresh(['vans', 'users', 'companies', 'trips']);
      console.log('✅ All cache refresh completed');
    } catch (error) {
      console.error('❌ All cache refresh failed:', error);
    }
  }, [cacheManager]);

  const clearCache = useCallback(() => {
    console.log('🗑️ Clearing all caches');
    
    // Use centralized clear
    cacheManager.clearGlobalCache();
    queryClient.clear();
    
    // Clear legacy global caches
    if (typeof window !== 'undefined') {
      (window as any).globalVansCache = null;
      (window as any).globalFetchPromise = null;
    }
  }, [cacheManager, queryClient]);

  const getStats = useCallback(() => {
    return cacheManager.getStats();
  }, [cacheManager]);

  return {
    refreshPage,
    refreshAll,
    clearCache,
    getStats,
    // Expose specific refresh methods
    refreshVans: cacheManager.refreshVans,
    refreshUsers: cacheManager.refreshUsers,
    refreshCompanies: cacheManager.refreshCompanies,
    refreshTrips: cacheManager.refreshTrips,
  };
};
