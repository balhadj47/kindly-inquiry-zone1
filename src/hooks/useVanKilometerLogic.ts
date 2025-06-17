
import { useState, useEffect } from 'react';
import { useLastTripKm } from '@/hooks/useLastTripKm';

interface UseVanKilometerLogicProps {
  vanId: string;
  startKm: string;
  onStartKmChange: (value: string) => void;
}

export const useVanKilometerLogic = ({ vanId, startKm, onStartKmChange }: UseVanKilometerLogicProps) => {
  const [previousVanId, setPreviousVanId] = useState('');
  const { lastKm, loading: loadingLastKm } = useLastTripKm(vanId);

  // Handle van change - clear startKm immediately when van changes
  useEffect(() => {
    if (vanId !== previousVanId) {
      console.log('Van changed from', previousVanId, 'to', vanId);
      setPreviousVanId(vanId);
      
      // Always clear the startKm when van changes
      if (vanId) {
        console.log('Clearing startKm due to van change');
        onStartKmChange('');
      }
    }
  }, [vanId, previousVanId, onStartKmChange]);

  // Auto-populate starting kilometers when lastKm data is available
  useEffect(() => {
    if (vanId && lastKm !== null && !loadingLastKm) {
      console.log('Auto-populating start km with lastKm:', lastKm);
      onStartKmChange(lastKm.toString());
    }
  }, [lastKm, vanId, loadingLastKm, onStartKmChange]);

  return {
    lastKm,
    loadingLastKm
  };
};
