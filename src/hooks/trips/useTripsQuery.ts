import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Trip } from '@/types/trip';
import { transformDatabaseToTrip } from '@/utils/tripTransformers';

export const useTripsQuery = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['trips', page, limit],
    queryFn: async (): Promise<{ trips: Trip[]; total: number }> => {
      console.log('🚗 useTripsQuery: Fetching trips page', page);
      const startTime = performance.now();
      
      const offset = (page - 1) * limit;
      
      const { count } = await supabase
        .from('trips')
        .select('*', { count: 'exact', head: true });

      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('🚗 useTripsQuery: Error:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log('🚗 useTripsQuery: Fetched in:', endTime - startTime, 'ms');
      
      const transformedTrips: Trip[] = (data || []).map(transformDatabaseToTrip);
      
      return {
        trips: transformedTrips,
        total: count || 0
      };
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Keep the old export for backward compatibility
export const useTrips = useTripsQuery;
