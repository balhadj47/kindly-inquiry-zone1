
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Trip {
  id: string;
  van: string;
  driver: string;
  company: string;
  branch: string;
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
  status?: string;
  user_ids?: string[];
  user_roles?: any;
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
      
      // Transform database records to match Trip interface
      const transformedTrips: Trip[] = (data || []).map(trip => ({
        id: trip.id.toString(),
        van: trip.van || '',
        driver: trip.driver || '',
        company: trip.company || '',
        branch: trip.branch || '',
        start_date: trip.created_at, // Use created_at as start_date fallback
        end_date: null, // Set to null since there's no end_date in database
        start_km: trip.start_km || 0,
        end_km: trip.end_km || null,
        destination: trip.notes || '', // Use notes as destination fallback
        notes: trip.notes || '',
        company_id: '', // Will need to be populated from relations if needed
        branch_id: '', // Will need to be populated from relations if needed
        created_at: trip.created_at,
        updated_at: trip.created_at, // Fallback to created_at
        status: trip.status || 'active',
        user_ids: trip.user_ids || [],
        user_roles: trip.user_roles || [],
      }));
      
      return {
        trips: transformedTrips,
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
        .eq('status', 'active') // Filter by status instead of end_date
        .order('created_at', { ascending: false });

      if (error) {
        console.error('🚗 useTripsOptimized: Error:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log('🚗 useTripsOptimized: Fetched active trips in:', endTime - startTime, 'ms');
      
      // Transform database records to match Trip interface
      return (data || []).map(trip => ({
        id: trip.id.toString(),
        van: trip.van || '',
        driver: trip.driver || '',
        company: trip.company || '',
        branch: trip.branch || '',
        start_date: trip.created_at,
        end_date: null, // Set to null since there's no end_date in database
        start_km: trip.start_km || 0,
        end_km: trip.end_km || null,
        destination: trip.notes || '',
        notes: trip.notes || '',
        company_id: '',
        branch_id: '',
        created_at: trip.created_at,
        updated_at: trip.created_at,
        status: trip.status || 'active',
        user_ids: trip.user_ids || [],
        user_roles: trip.user_roles || [],
      }));
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
      
      // Convert string ID to number for database query
      const numericId = parseInt(tripId, 10);
      
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', numericId)
        .single();

      if (error) {
        console.error('🚗 useTripsOptimized: Error:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log('🚗 useTripsOptimized: Fetched trip in:', endTime - startTime, 'ms');
      
      // Transform database record to match Trip interface
      return {
        id: data.id.toString(),
        van: data.van || '',
        driver: data.driver || '',
        company: data.company || '',
        branch: data.branch || '',
        start_date: data.created_at,
        end_date: null, // Set to null since there's no end_date in database
        start_km: data.start_km || 0,
        end_km: data.end_km || null,
        destination: data.notes || '',
        notes: data.notes || '',
        company_id: '',
        branch_id: '',
        created_at: data.created_at,
        updated_at: data.created_at,
        status: data.status || 'active',
        user_ids: data.user_ids || [],
        user_roles: data.user_roles || [],
      };
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
          driver: tripData.driver || '',
          company: tripData.company || '',
          branch: tripData.branch || '',
          start_km: tripData.start_km || 0,
          notes: tripData.notes || '',
          user_ids: tripData.user_ids || [],
          user_roles: tripData.user_roles || [],
          status: 'active',
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
      // Convert string ID to number for database query
      const numericId = parseInt(id, 10);
      
      const { data, error } = await supabase
        .from('trips')
        .update({
          van: tripData.van,
          driver: tripData.driver,
          company: tripData.company,
          branch: tripData.branch,
          end_km: tripData.end_km,
          notes: tripData.notes,
          status: tripData.status,
        })
        .eq('id', numericId)
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
      // Convert string ID to number for database query
      const numericId = parseInt(tripId, 10);
      
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', numericId);

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
