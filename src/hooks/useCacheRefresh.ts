
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useCacheRefresh = () => {
  const queryClient = useQueryClient();

  const refreshPage = useCallback((queryKeys: string[]) => {
    // Invalidate and refetch specific queries
    queryKeys.forEach(key => {
      queryClient.invalidateQueries({ queryKey: [key] });
    });
  }, [queryClient]);

  const refreshAll = useCallback(() => {
    // Clear all cache and refetch
    queryClient.invalidateQueries();
  }, [queryClient]);

  const clearCache = useCallback(() => {
    // Remove all cached data
    queryClient.clear();
  }, [queryClient]);

  return {
    refreshPage,
    refreshAll,
    clearCache,
  };
};
