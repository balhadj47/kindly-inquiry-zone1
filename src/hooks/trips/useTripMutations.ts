import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trip } from '@/contexts/TripContext';
import { useTrip } from '@/contexts/TripContext';

const transformDatabaseToTrip = (databaseTrip: any): Trip => ({
  id: databaseTrip.id.toString(),
  van: databaseTrip.van || '',
  driver: databaseTrip.driver || '',
  company: databaseTrip.company || '',
  branch: databaseTrip.branch || '',
  start_date: databaseTrip.planned_start_date ? new Date(databaseTrip.planned_start_date).toISOString() : null,
  end_date: databaseTrip.planned_end_date ? new Date(databaseTrip.planned_end_date).toISOString() : null,
  startKm: databaseTrip.start_km || 0,
  endKm: databaseTrip.end_km || null,
  destination: databaseTrip.destination || '',
  notes: databaseTrip.notes || '',
  company_id: databaseTrip.company_id || '',
  branch_id: databaseTrip.branch_id || '',
  created_at: databaseTrip.created_at ? new Date(databaseTrip.created_at).toISOString() : null,
  updated_at: databaseTrip.updated_at ? new Date(databaseTrip.updated_at).toISOString() : null,
  timestamp: databaseTrip.timestamp ? new Date(databaseTrip.timestamp).toISOString() : null,
  status: databaseTrip.status || 'active',
  user_ids: databaseTrip.user_ids || [],
  user_roles: databaseTrip.user_roles || {},
  companies_data: databaseTrip.companies_data || [],
  start_km: databaseTrip.start_km || null,
  end_km: databaseTrip.end_km || null,
});

export const useTripMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { addTrip: addTripToCache, removeTrip: removeTripFromCache, updateTrip: updateTripInCache } = useTrip();

  const updateTrip = useMutation({
    mutationFn: async ({ id, ...tripData }: { id: string; [key: string]: any }) => {
      console.log(`Updating trip with ID: ${id} and data:`, tripData);

      const { data, error } = await supabase
        .from('trips')
        .update(tripData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error(`❌ Error updating trip with ID ${id}:`, error);
        throw error;
      }

      console.log(`✅ Trip with ID ${id} updated successfully:`, data);
      return data;
    },
    onSuccess: (data) => {
      // Optimistically update the cache
      const updatedTrip = transformDatabaseToTrip(data);
      updateTripInCache(updatedTrip);

      // Invalidate and refetch query
      queryClient.invalidateQueries({ queryKey: ['trips'] });

      toast({
        title: 'Succès',
        description: 'Mission mise à jour avec succès',
      });
    },
    onError: (error, variables) => {
      console.error(`Error updating trip with ID ${variables.id}:`, error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour la mission',
        variant: 'destructive',
      });
    },
  });

  const deleteTrip = useMutation({
    mutationFn: async (id: string) => {
      console.log('🗑️ Deleting trip with ID:', id);

      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Error deleting trip:', error);
        throw error;
      }

      console.log('✅ Trip deleted successfully:', id);
      return id;
    },
    onSuccess: (id) => {
      // Optimistically remove from cache
      removeTripFromCache(id);

      // Invalidate and refetch query
      queryClient.invalidateQueries({ queryKey: ['trips'] });

      toast({
        title: 'Succès',
        description: 'Mission supprimée avec succès',
      });
    },
    onError: (error, id) => {
      console.error(`Error deleting trip with ID ${id}:`, error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la mission',
        variant: 'destructive',
      });
    },
  });

  const createTrip = useMutation({
    mutationFn: async (tripData: any) => {
      console.log('🚀 Creating trip with data:', tripData);

      const { data, error } = await supabase
        .from('trips')
        .insert([{
          van: tripData.van,
          driver: tripData.driver,
          company: tripData.company,
          branch: tripData.branch,
          destination: tripData.destination,
          notes: tripData.notes,
          start_km: tripData.start_km,
          company_id: tripData.company_id,
          branch_id: tripData.branch_id,
          user_ids: tripData.user_ids || [],
          user_roles: tripData.user_roles || [],
          status: 'active',
          planned_start_date: tripData.start_date,
          planned_end_date: tripData.end_date,
        }])
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating trip:', error);
        throw error;
      }

      console.log('✅ Trip created successfully:', data);
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
        startKm: tripData.start_km || 0,
        endKm: null,
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
      if (context?.optimisticTrip) {
        removeTripFromCache(context.optimisticTrip.id.toString());
        const realTrip = transformDatabaseToTrip(data);
        addTripToCache(realTrip);
      }

      // Update React Query cache
      queryClient.setQueryData(['trips'], (oldData: Trip[] = []) => {
        const realTrip = transformDatabaseToTrip(data);
        return [...oldData.filter(trip => trip.id !== context?.optimisticTrip?.id), realTrip];
      });

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

  return {
    createTrip,
    updateTrip,
    deleteTrip,
  };
};
