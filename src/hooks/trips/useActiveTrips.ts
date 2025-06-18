
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Trip } from '@/types/trip';
import { transformDatabaseToTrip } from '@/utils/tripTransformers';

export const useActiveTrips = () => {
  return useQuery({
    queryKey: ['trips', 'active'],
    queryFn: async (): Promise<Trip[]> => {
      console.log('🚗 useActiveTrips: Fetching active trips...');
      const startTime = performance.now();
      
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('🚗 useActiveTrips: Error:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log('🚗 useActiveTrips: Fetched active trips in:', endTime - startTime, 'ms');
      
      return (data || []).map(transformDatabaseToTrip);
    },
    staleTime: 1 * 60 * 1000,
    gcTime: 3 * 60 * 1000,
  });
};
