
import { useEffect, useCallback, useRef } from 'react';

interface UseRealTimeUpdatesProps {
  onUpdate: () => Promise<void>;
  interval?: number;
  enabled?: boolean;
}

export const useRealTimeUpdates = ({ 
  onUpdate, 
  interval = 30000, // 30 seconds default
  enabled = true 
}: UseRealTimeUpdatesProps) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isUpdatingRef = useRef(false);

  const startRealTimeUpdates = useCallback(() => {
    if (!enabled || intervalRef.current) return;

    console.log('🔄 Starting real-time updates every', interval / 1000, 'seconds');
    
    intervalRef.current = setInterval(async () => {
      if (isUpdatingRef.current) return;
      
      try {
        isUpdatingRef.current = true;
        console.log('🔄 Real-time update triggered');
        await onUpdate();
      } catch (error) {
        console.error('❌ Real-time update failed:', error);
      } finally {
        isUpdatingRef.current = false;
      }
    }, interval);
  }, [onUpdate, interval, enabled]);

  const stopRealTimeUpdates = useCallback(() => {
    if (intervalRef.current) {
      console.log('⏹️ Stopping real-time updates');
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const forceUpdate = useCallback(async () => {
    if (isUpdatingRef.current) return;
    
    try {
      isUpdatingRef.current = true;
      console.log('🔄 Force update triggered');
      await onUpdate();
    } catch (error) {
      console.error('❌ Force update failed:', error);
    } finally {
      isUpdatingRef.current = false;
    }
  }, [onUpdate]);

  useEffect(() => {
    if (enabled) {
      startRealTimeUpdates();
    } else {
      stopRealTimeUpdates();
    }

    return () => {
      stopRealTimeUpdates();
    };
  }, [enabled, startRealTimeUpdates, stopRealTimeUpdates]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRealTimeUpdates();
    };
  }, [stopRealTimeUpdates]);

  return {
    forceUpdate,
    startRealTimeUpdates,
    stopRealTimeUpdates,
    isEnabled: enabled && !!intervalRef.current
  };
};
