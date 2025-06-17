
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseVanKilometerLogicProps {
  vanId: string;
  startKm: string;
  onStartKmChange: (value: string) => void;
}

export const useVanKilometerLogic = ({ vanId, startKm, onStartKmChange }: UseVanKilometerLogicProps) => {
  const [lastKm, setLastKm] = useState<number | null>(null);
  const [loadingLastKm, setLoadingLastKm] = useState(false);

  useEffect(() => {
    const fetchLastKm = async () => {
      if (!vanId) {
        setLastKm(null);
        return;
      }

      setLoadingLastKm(true);
      try {
        // First try to get the last end_km
        const { data: endKmData, error: endKmError } = await (supabase as any)
          .from('trips')
          .select('end_km, start_km, created_at')
          .eq('van', vanId)
          .not('end_km', 'is', null)
          .order('created_at', { ascending: false })
          .limit(1);

        if (endKmError) {
          console.error('Error fetching end km:', endKmError);
        }

        if (endKmData && endKmData.length > 0) {
          const lastEndKm = endKmData[0].end_km;
          setLastKm(lastEndKm);
          if (!startKm) {
            onStartKmChange(lastEndKm.toString());
          }
          return;
        }

        // If no end_km found, try to get the last start_km
        const { data: startKmData, error: startKmError } = await (supabase as any)
          .from('trips')
          .select('start_km')
          .eq('van', vanId)
          .not('start_km', 'is', null)
          .order('created_at', { ascending: false })
          .limit(1);

        if (startKmError) {
          console.error('Error fetching start km:', startKmError);
        }

        if (startKmData && startKmData.length > 0) {
          const lastStartKm = startKmData[0].start_km;
          setLastKm(lastStartKm);
          if (!startKm) {
            onStartKmChange(lastStartKm.toString());
          }
        } else {
          // No previous trip data found
          setLastKm(null);
        }
      } catch (error) {
        console.error('Error in fetchLastKm:', error);
        setLastKm(null);
      } finally {
        setLoadingLastKm(false);
      }
    };

    fetchLastKm();
  }, [vanId]); // Removed startKm and onStartKmChange from dependencies

  return { lastKm, loadingLastKm };
};
