
import { useCallback, useRef } from 'react';

interface UseRealTimeUpdatesProps {
  onUpdate: () => Promise<void>;
  enabled?: boolean;
}

export const useRealTimeUpdates = ({ 
  onUpdate, 
  enabled = true 
}: UseRealTimeUpdatesProps) => {
  const isUpdatingRef = useRef(false);

  const forceUpdate = useCallback(async () => {
    if (isUpdatingRef.current || !enabled) return;
    
    try {
      isUpdatingRef.current = true;
      console.log('🔄 Manual update triggered');
      await onUpdate();
    } catch (error) {
      console.error('❌ Manual update failed:', error);
    } finally {
      isUpdatingRef.current = false;
    }
  }, [onUpdate, enabled]);

  return {
    forceUpdate,
    isEnabled: enabled,
    isUpdating: isUpdatingRef.current
  };
};
