import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trip } from '@/types/trip';
import { transformDatabaseToTrip } from '@/utils/tripTransformers';

export const useTripMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateCacheOptimistically = (updatedTrip: Partial<Trip> & { id: string }) => {
    // Update all trip-related queries immediately
    queryClient.setQueriesData(
      { queryKey: ['trips'] },
      (oldData: any) => {
        if (!oldData) return oldData;
        
        if (oldData.trips) {
          // Handle paginated data structure
          return {
            ...oldData,
            trips: oldData.trips.map((trip: Trip) => 
              trip.id.toString() === updatedTrip.id ? { ...trip, ...updatedTrip } : trip
            )
          };
        } else if (Array.isArray(oldData)) {
          // Handle simple array structure
          return oldData.map((trip: Trip) => 
            trip.id.toString() === updatedTrip.id ? { ...trip, ...updatedTrip } : trip
          );
        }
        return oldData;
      }
    );
  };

  const addTripToCache = (newTrip: Trip) => {
    queryClient.setQueriesData(
      { queryKey: ['trips'] },
      (oldData: any) => {
        if (!oldData) return { trips: [newTrip], total: 1 };
        
        if (oldData.trips) {
          // Handle paginated data structure
          return {
            ...oldData,
            trips: [newTrip, ...oldData.trips],
            total: (oldData.total || 0) + 1
          };
        } else if (Array.isArray(oldData)) {
          // Handle simple array structure
          return [newTrip, ...oldData];
        }
        return oldData;
      }
    );
  };

  const removeTripFromCache = (tripId: string) => {
    queryClient.setQueriesData(
      { queryKey: ['trips'] },
      (oldData: any) => {
        if (!oldData) return oldData;
        
        if (oldData.trips) {
          // Handle paginated data structure
          return {
            ...oldData,
            trips: oldData.trips.filter((trip: Trip) => trip.id.toString() !== tripId),
            total: Math.max((oldData.total || 0) - 1, 0)
          };
        } else if (Array.isArray(oldData)) {
          // Handle simple array structure
          return oldData.filter((trip: Trip) => trip.id.toString() !== tripId);
        }
        return oldData;
      }
    );
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
          planned_start_date: tripData.start_date,
          planned_end_date: tripData.end_date,
        }])
        .select()
        .single();

      if (error) throw error;

      // Update van status to "En Transit"
      if (tripData.van) {
        const { error: vanError } = await supabase
          .from('vans')
          .update({ status: 'En Transit' })
          .eq('id', tripData.van);

        if (vanError) {
          console.error('Error updating van status:', vanError);
        }
      }

      return data;
    },
    onMutate: async (tripData) => {
      // Create optimistic trip data
      const optimisticTrip: Trip = {
        id: Date.now().toString(), // Convert to string
        van: tripData.van || '',
        driver: tripData.driver || '',
        company: tripData.company || '',
        branch: tripData.branch || '',
        start_date: new Date().toISOString(),
        end_date: null,
        start_km: tripData.start_km || 0,
        end_km: null,
        destination: tripData.destination || '',
        notes: tripData.notes || '',
        company_id: tripData.company_id || '',
        branch_id: tripData.branch_id || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'active',
        user_ids: tripData.user_ids || [],
        user_roles: tripData.user_roles || {},
      };

      // Add to cache immediately
      addTripToCache(optimisticTrip);
      
      return { optimisticTrip };
    },
    onSuccess: (data, variables, context) => {
      // Replace optimistic data with real data
      if (context?.optimisticTriip) {
        removeTripFromCache(context.optimisticTrip.id.toString());
        const realTrip = transformDatabaseToTrip(data);
        addTripToCache(realTrip);
      }
      
      // Update van cache
      queryClient.invalidateQueries({ queryKey: ['vans'] });
      
      toast({
        title: 'Succès',
        description: 'Mission créée avec succès',
      });
    },
    onError: (error, variables, context) => {
      // Remove optimistic data on error
      if (context?.optimisticTrip) {
        removeTripFromCache(context.optimisticTrip.id.toString());
      }
      
      console.error('Error creating trip:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la mission',
        variant: 'destructive',
      });
    },
  });

  const updateTrip = useMutation({
    mutationFn: async ({ id, ...tripData }: Partial<Trip> & { id: string }) => {
      const numericId = parseInt(id, 10);
      
      const { data: currentTrip } = await supabase
        .from('trips')
        .select('van, status')
        .eq('id', numericId)
        .single();
      
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

      // If trip is being completed, update van status to Active
      if (tripData.end_km && currentTrip?.van) {
        const { error: vanError } = await supabase
          .from('vans')
          .update({ status: 'Active' })
          .eq('id', currentTrip.van);

        if (vanError) {
          console.error('Error updating van status:', vanError);
        }
      }

      return data;
    },
    onMutate: async ({ id, ...tripData }) => {
      // Update cache immediately
      updateCacheOptimistically({ id, ...tripData });
    },
    onSuccess: (data) => {
      // Ensure cache is consistent with server data
      const updatedTrip = transformDatabaseToTrip(data);
      updateCacheOptimistically({ id: updatedTrip.id.toString(), ...updatedTrip });
      
      // Update van cache
      queryClient.invalidateQueries({ queryKey: ['vans'] });
      
      toast({
        title: 'Succès',
        description: 'Mission modifiée avec succès',
      });
    },
    onError: (error, variables) => {
      // Revert optimistic update
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      
      console.error('Error updating trip:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier la mission',
        variant: 'destructive',
      });
    },
  });

  const deleteTrip = useMutation({
    mutationFn: async (tripId: string) => {
      const numericId = parseInt(tripId, 10);
      
      const { data: tripData } = await supabase
        .from('trips')
        .select('van, status')
        .eq('id', numericId)
        .single();
      
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', numericId);

      if (error) throw error;

      // If the trip was active, update van status back to Active
      if (tripData?.van && tripData?.status === 'active') {
        const { error: vanError } = await supabase
          .from('vans')
          .update({ status: 'Active' })
          .eq('id', tripData.van);

        if (vanError) {
          console.error('Error updating van status:', vanError);
        }
      }

      return tripData;
    },
    onMutate: async (tripId) => {
      // Remove from cache immediately
      removeTripFromCache(tripId);
    },
    onSuccess: () => {
      // Update van cache
      queryClient.invalidateQueries({ queryKey: ['vans'] });
      
      toast({
        title: 'Succès',
        description: 'Mission supprimée avec succès',
      });
    },
    onError: (error, tripId) => {
      // Revert optimistic update
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      
      console.error('Error deleting trip:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la mission',
        variant: 'destructive',
      });
    },
  });

  return {
    createTrip,
    updateTrip,
    deleteTrip,
  };
};
