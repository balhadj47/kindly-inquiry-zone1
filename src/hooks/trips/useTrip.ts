
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Trip } from '@/types/trip';
import { transformDatabaseToTrip } from '@/utils/tripTransformers';

export const useTrip = (tripId: string | null) => {
  return useQuery({
    queryKey: ['trips', tripId],
    queryFn: async (): Promise<Trip | null> => {
      if (!tripId) return null;
      
      console.log('🚗 useTrip: Fetching trip:', tripId);
      const startTime = performance.now();
      
      const numericId = parseInt(tripId, 10);
      
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', numericId)
        .single();

      if (error) {
        console.error('🚗 useTrip: Error:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log('🚗 useTrip: Fetched trip in:', endTime - startTime, 'ms');
      
      return transformDatabaseToTrip(data);
    },
    enabled: !!tripId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
