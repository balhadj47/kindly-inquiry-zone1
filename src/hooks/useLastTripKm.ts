
import { useState, useEffect } from 'react';
import { supabase, requireAuth } from '@/integrations/supabase/client';

export const useLastTripKm = (vanId: string) => {
  const [lastKm, setLastKm] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!vanId) {
      setLastKm(null);
      return;
    }

    const fetchLastTripKm = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Require authentication
        await requireAuth();
        
        console.log('Fetching last trip km for van:', vanId);
        
        const { data, error } = await supabase
          .from('trips')
          .select('end_km, start_km, created_at')
          .eq('van', vanId)
          .not('end_km', 'is', null)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          console.error('Error fetching last trip km:', error);
          throw error;
        }

        if (data?.end_km) {
          console.log('Found last trip end_km:', data.end_km);
          setLastKm(data.end_km);
        } else {
          console.log('No completed trips found for van, checking if there are any trips with start_km');
          
          // If no completed trips, try to get the start_km from the most recent trip
          const { data: startKmData, error: startKmError } = await supabase
            .from('trips')
            .select('start_km')
            .eq('van', vanId)
            .not('start_km', 'is', null)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (startKmData?.start_km && !startKmError) {
            console.log('Found start_km from last trip:', startKmData.start_km);
            setLastKm(startKmData.start_km);
          } else {
            setLastKm(null);
          }
        }
      } catch (err) {
        console.error('Exception fetching last trip km:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch last trip data');
        setLastKm(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLastTripKm();
  }, [vanId]);

  return { lastKm, loading, error };
};
