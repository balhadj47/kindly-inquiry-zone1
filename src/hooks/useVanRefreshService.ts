
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { vanRefreshService } from '@/services/vanRefreshService';

export const useVanRefreshService = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    vanRefreshService.setQueryClient(queryClient);
  }, [queryClient]);

  return {
    forceRefreshVans: () => vanRefreshService.forceRefreshVans(),
    refreshAfterTripChange: () => vanRefreshService.refreshAfterTripChange()
  };
};
