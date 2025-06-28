
import { useQueryClient } from '@tanstack/react-query';
import { useVans } from '@/hooks/useVansOptimized';
import { useMemo } from 'react';

export const useFastVanData = () => {
  const queryClient = useQueryClient();
  const { data: vans = [], isLoading } = useVans();

  // Create a fast lookup map for van display names
  const vanDisplayMap = useMemo(() => {
    const map = new Map<string, string>();
    
    vans.forEach(van => {
      if (van) {
        const displayName = van.license_plate 
          ? `${van.license_plate} (${van.model})` 
          : van.model;
        
        // Map both ID and reference_code to display name
        map.set(van.id, displayName);
        if (van.reference_code) {
          map.set(van.reference_code, displayName);
        }
      }
    });
    
    return map;
  }, [vans]);

  const getVanDisplayName = (vanId: string): string => {
    return vanDisplayMap.get(vanId) || vanId;
  };

  // Check if van data is already cached
  const isVanDataCached = () => {
    const cachedData = queryClient.getQueryData(['vans']);
    return !!cachedData;
  };

  return {
    vans,
    isLoading: isLoading && !isVanDataCached(),
    getVanDisplayName,
    vanDisplayMap,
    isVanDataCached
  };
};
