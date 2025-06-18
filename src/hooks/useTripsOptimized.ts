
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Trip {
  id: string;
  van: string;
  start_date: string;
  end_date: string | null;
  start_km: number;
  end_km: number | null;
  destination: string;
  notes?: string;
  company_id: string;
  branch_id: string;
  created_at: string;
  updated_at: string;
}

// Base hook for all trips with pagination
export const useTrips = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['trips', page, limit],
    queryFn: async (): Promise<{ trips: Trip[]; total: number }> => {
      console.log('🚗 useTripsOptimized: Fetching trips page', page);
      const startTime = performance.now();
      
      const offset = (page - 1) * limit;
      
      // Get total count
      const { count } = await supabase
        .from('trips')
        .select('*', { count: 'exact', head: true });

      // Get paginated trips
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('🚗 useTripsOptimized: Error:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log('🚗 useTripsOptimized: Fetched in:', endTime - startTime, 'ms');
      
      return {
        trips: data || [],
        total: count || 0
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for active trips
export const useActiveTrips = () => {
  return useQuery({
    queryKey: ['trips', 'active'],
    queryFn: async (): Promise<Trip[]> => {
      console.log('🚗 useTripsOptimized: Fetching active trips...');
      const startTime = performance.now();
      
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .is('end_date', null)
        .order('start_date', { ascending: false });

      if (error) {
        console.error('🚗 useTripsOptimized: Error:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log('🚗 useTripsOptimized: Fetched active trips in:', endTime - startTime, 'ms');
      
      return data || [];
    },
    staleTime: 1 * 60 * 1000, // 1 minute (shorter for active trips)
    gcTime: 3 * 60 * 1000, // 3 minutes
  });
};

// Hook for a single trip
export const useTrip = (tripId: string | null) => {
  return useQuery({
    queryKey: ['trips', tripId],
    queryFn: async (): Promise<Trip | null> => {
      if (!tripId) return null;
      
      console.log('🚗 useTripsOptimized: Fetching trip:', tripId);
      const startTime = performance.now();
      
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .single();

      if (error) {
        console.error('🚗 useTripsOptimized: Error:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log('🚗 useTripsOptimized: Fetched trip in:', endTime - startTime, 'ms');
      
      return data;
    },
    enabled: !!tripId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Mutations for trip operations
export const useTripMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const invalidateTrips = () => {
    queryClient.invalidateQueries({ queryKey: ['trips'] });
  };

  const createTrip = useMutation({
    mutationFn: async (tripData: Partial<Trip>) => {
      const { data, error } = await supabase
        .from('trips')
        .insert([{
          van: tripData.van || '',
          start_date: tripData.start_date || new Date().toISOString(),
          start_km: tripData.start_km || 0,
          destination: tripData.destination || '',
          notes: tripData.notes,
          company_id: tripData.company_id || '',
          branch_id: tripData.branch_id || '',
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      invalidateTrips();
      toast({
        title: 'Succès',
        description: 'Voyage créé avec succès',
      });
    },
    onError: (error) => {
      console.error('Error creating trip:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le voyage',
        variant: 'destructive',
      });
    },
  });

  const updateTrip = useMutation({
    mutationFn: async ({ id, ...tripData }: Partial<Trip> & { id: string }) => {
      const { data, error } = await supabase
        .from('trips')
        .update({
          van: tripData.van,
          end_date: tripData.end_date,
          end_km: tripData.end_km,
          destination: tripData.destination,
          notes: tripData.notes,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      invalidateTrips();
      toast({
        title: 'Succès',
        description: 'Voyage modifié avec succès',
      });
    },
    onError: (error) => {
      console.error('Error updating trip:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier le voyage',
        variant: 'destructive',
      });
    },
  });

  const deleteTrip = useMutation({
    mutationFn: async (tripId: string) => {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', tripId);

      if (error) throw error;
    },
    onSuccess: () => {
      invalidateTrips();
      toast({
        title: 'Succès',
        description: 'Voyage supprimé avec succès',
      });
    },
    onError: (error) => {
      console.error('Error deleting trip:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le voyage',
        variant: 'destructive',
      });
    },
  });

  return {
    createTrip,
    updateTrip,
    deleteTrip,
    invalidateTrips,
  };
};
