
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trip } from '@/contexts/TripContext';

const transformDatabaseToTrip = (databaseTrip: any): Trip => ({
  id: databaseTrip.id.toString(),
  van: databaseTrip.van || '',
  driver: databaseTrip.driver || '',
  company: databaseTrip.company || '',
  branch: databaseTrip.branch || '',
  start_date: databaseTrip.planned_start_date || databaseTrip.start_date || new Date().toISOString(),
  end_date: databaseTrip.planned_end_date || databaseTrip.end_date || null,
  start_km: databaseTrip.start_km || 0,
  end_km: databaseTrip.end_km || null,
  destination: databaseTrip.destination || '',
  notes: databaseTrip.notes || '',
  created_at: databaseTrip.created_at || new Date().toISOString(),
  updated_at: databaseTrip.updated_at || new Date().toISOString(),
  status: databaseTrip.status || 'active',
  user_ids: databaseTrip.user_ids || [],
  user_roles: databaseTrip.user_roles || [],
  timestamp: databaseTrip.created_at || new Date().toISOString(),
});

export const useTripMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateTrip = useMutation({
    mutationFn: async ({ id, ...tripData }: { id: string; [key: string]: any }) => {
      console.log(`Updating trip with ID: ${id} and data:`, tripData);

      const numericId = parseInt(id, 10);
      const { data, error } = await supabase
        .from('trips')
        .update(tripData)
        .eq('id', numericId)
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
      // Update React Query cache
      queryClient.setQueryData(['trips'], (oldData: Trip[] = []) => {
        const updatedTrip = transformDatabaseToTrip(data);
        return oldData.map(trip => 
          trip.id === updatedTrip.id ? updatedTrip : trip
        );
      });

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

      const numericId = parseInt(id, 10);
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', numericId);

      if (error) {
        console.error('❌ Error deleting trip:', error);
        throw error;
      }

      console.log('✅ Trip deleted successfully:', id);
      return id;
    },
    onSuccess: (id) => {
      // Update React Query cache
      const numericId = parseInt(id, 10);
      queryClient.setQueryData(['trips'], (oldData: Trip[] = []) => {
        return oldData.filter(trip => parseInt(trip.id) !== numericId);
      });

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
          planned_start_date: tripData.startDate,
          planned_end_date: tripData.endDate,
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
        id: Date.now().toString(),
        van: tripData.van || '',
        driver: tripData.driver || '',
        company: tripData.company || '',
        branch: tripData.branch || '',
        start_date: tripData.startDate ? tripData.startDate.toISOString() : new Date().toISOString(),
        end_date: tripData.endDate ? tripData.endDate.toISOString() : null,
        start_km: tripData.start_km || 0,
        end_km: null,
        destination: tripData.destination || '',
        notes: tripData.notes || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        status: 'active',
        user_ids: tripData.user_ids || [],
        user_roles: tripData.user_roles || [],
      };

      // Add to React Query cache optimistically
      queryClient.setQueryData(['trips'], (oldData: Trip[] = []) => {
        return [optimisticTrip, ...oldData];
      });
      
      return { optimisticTrip };
    },
    onSuccess: (data, variables, context) => {
      // Replace optimistic data with real data
      const realTrip = transformDatabaseToTrip(data);
      queryClient.setQueryData(['trips'], (oldData: Trip[] = []) => {
        return oldData.map(trip => 
          trip.id === context?.optimisticTrip?.id ? realTrip : trip
        );
      });

      toast({
        title: 'Succès',
        description: 'Mission créée avec succès',
      });
    },
    onError: (error, variables, context) => {
      // Remove optimistic data on error
      if (context?.optimisticTrip) {
        queryClient.setQueryData(['trips'], (oldData: Trip[] = []) => {
          return oldData.filter(trip => trip.id !== context.optimisticTrip.id);
        });
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
