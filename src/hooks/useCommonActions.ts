
import { useState, useCallback } from 'react';
import { useCacheRefresh } from '@/hooks/useCacheRefresh';

interface UseCommonActionsOptions {
  refetch?: () => Promise<any>;
  refreshKeys?: string[];
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export const useCommonActions = (options: UseCommonActionsOptions = {}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { refreshPage } = useCacheRefresh();

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      if (options.refetch && typeof options.refetch === 'function') {
        await options.refetch();
      }
      if (refreshPage && typeof refreshPage === 'function' && options.refreshKeys) {
        await refreshPage(options.refreshKeys);
      }
      options.onSuccess?.();
    } catch (error) {
      console.error('Error refreshing:', error);
      options.onError?.(error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  }, [isRefreshing, options, refreshPage]);

  const setLoadingAction = useCallback((action: string | null) => {
    setActionLoading(action);
  }, []);

  return {
    isRefreshing,
    actionLoading,
    handleRefresh,
    setLoadingAction
  };
};
