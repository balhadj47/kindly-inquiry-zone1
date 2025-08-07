import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trip } from '@/contexts/TripContext';

const transformDatabaseToTrip = (databaseTrip: any): Trip => ({
  id: parseInt(databaseTrip.id),
  van: databaseTrip.van || '',
  driver: databaseTrip.driver || '',
  company: databaseTrip.company || '',
  branch: databaseTrip.branch || '',
  startDate: databaseTrip.planned_start_date ? new Date(databaseTrip.planned_start_date) : undefined,
  endDate: databaseTrip.planned_end_date ? new Date(databaseTrip.planned_end_date) : undefined,
  startKm: databaseTrip.start_km || 0,
  endKm: databaseTrip.end_km || null,
  destination: databaseTrip.destination || '',
  notes: databaseTrip.notes || '',
  created_at: databaseTrip.created_at || new Date().toISOString(),
  updated_at: databaseTrip.updated_at || new Date().toISOString(),
  status: databaseTrip.status || 'active',
  userIds: databaseTrip.user_ids || [],
  userRoles: databaseTrip.user_roles || [],
  timestamp: databaseTrip.created_at || new Date().toISOString(),
  companies_data: databaseTrip.companies_data || [],
});

export const useTripMutationsOptimized = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateTrip = useMutation({
    mutationFn: async ({ id, ...tripData }: { id: string; [key: string]: any }) => {
      console.log('🚗 Updating trip:', id, tripData);
      const numericId = parseInt(id, 10);
      
      // If we're completing a trip (setting end_km and status to completed)
      if (tripData.status === 'completed' && tripData.end_km) {
        console.log('🚗 Trip being completed, will update van status');
        
        // First get the trip to find the van ID
        const { data: tripInfo, error: tripError } = await supabase
          .from('trips')
          .select('van')
          .eq('id', numericId)
          .single();

        if (tripError) {
          console.error('Error fetching trip info:', tripError);
          throw tripError;
        }

        // Update the trip
        const { data, error } = await supabase
          .from('trips')
          .update(tripData)
          .eq('id', numericId)
          .select()
          .single();

        if (error) throw error;

        // Update van status back to "Active" after successful trip update
        if (tripInfo?.van) {
          console.log('🚐 Updating van status to Active for van:', tripInfo.van);
          const { error: vanError } = await supabase
            .from('vans')
            .update({ status: 'Active' })
            .eq('id', tripInfo.van);

          if (vanError) {
            console.error('Error updating van status:', vanError);
            // Don't throw here, trip was updated successfully
          } else {
            console.log('✅ Van status updated to Active');
            // Invalidate vans query to refresh available vans
            queryClient.invalidateQueries({ queryKey: ['vans'] });
          }
        }

        return data;
      } else {
        // Regular trip update
        const { data, error } = await supabase
          .from('trips')
          .update(tripData)
          .eq('id', numericId)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onMutate: async ({ id, ...tripData }) => {
      await queryClient.cancelQueries({ queryKey: ['trips'] });
      
      const previousTrips = queryClient.getQueryData<Trip[]>(['trips']);
      const numericId = parseInt(id, 10);
      
      // Optimistically update the trip
      queryClient.setQueryData<Trip[]>(['trips'], (old = []) => 
        old.map(trip => 
          trip.id === numericId 
            ? { ...trip, ...tripData, updated_at: new Date().toISOString() }
            : trip
        )
      );

      return { previousTrips, tripId: numericId };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousTrips) {
        queryClient.setQueryData(['trips'], context.previousTrips);
      }
      
      console.error('Error updating trip:', err);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour la mission',
        variant: 'destructive',
      });
    },
    onSuccess: (data, variables) => {
      // Update with real data from server
      const realTrip = transformDatabaseToTrip(data);
      queryClient.setQueryData<Trip[]>(['trips'], (old = []) =>
        old.map(trip => trip.id === realTrip.id ? realTrip : trip)
      );

      // If this was a trip completion, show success message
      if (variables.status === 'completed') {
        toast({
          title: 'Succès',
          description: 'Mission terminée avec succès, le véhicule est maintenant disponible',
        });
      } else {
        toast({
          title: 'Succès',
          description: 'Mission mise à jour avec succès',
        });
      }
    }
  });

  const deleteTrip = useMutation({
    mutationFn: async (id: string) => {
      console.log('🚗 Deleting trip:', id);
      const numericId = parseInt(id, 10);
      
      // First get the trip to find the van ID and status
      const { data: tripInfo, error: tripError } = await supabase
        .from('trips')
        .select('van, status')
        .eq('id', numericId)
        .single();

      if (tripError) {
        console.error('Error fetching trip info:', tripError);
        throw tripError;
      }

      // Delete the trip
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', numericId);

      if (error) throw error;

      // If the trip was active, update van status back to "Active"
      if (tripInfo?.van && tripInfo?.status === 'active') {
        console.log('🚐 Updating van status to Active after trip deletion for van:', tripInfo.van);
        const { error: vanError } = await supabase
          .from('vans')
          .update({ status: 'Active' })
          .eq('id', tripInfo.van);

        if (vanError) {
          console.error('Error updating van status:', vanError);
          // Don't throw here, trip was deleted successfully
        } else {
          console.log('✅ Van status updated to Active after deletion');
          // Invalidate vans query to refresh available vans
          queryClient.invalidateQueries({ queryKey: ['vans'] });
        }
      }

      return numericId;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['trips'] });
      
      const previousTrips = queryClient.getQueryData<Trip[]>(['trips']);
      const numericId = parseInt(id, 10);
      
      // Optimistically remove the trip
      queryClient.setQueryData<Trip[]>(['trips'], (old = []) => 
        old.filter(trip => trip.id !== numericId)
      );

      return { previousTrips, tripId: numericId };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousTrips) {
        queryClient.setQueryData(['trips'], context.previousTrips);
      }
      
      console.error('Error deleting trip:', err);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la mission',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Succès',
        description: 'Mission supprimée avec succès, le véhicule est maintenant disponible',
      });
    }
  });

  const createTrip = useMutation({
    mutationFn: async (tripData: any) => {
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
          companies_data: tripData.selectedCompanies || [],
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (tripData) => {
      await queryClient.cancelQueries({ queryKey: ['trips'] });
      
      const previousTrips = queryClient.getQueryData<Trip[]>(['trips']);
      
      // Create optimistic trip
      const optimisticTrip: Trip = {
        id: Date.now(), // Temporary ID
        van: tripData.van || '',
        driver: tripData.driver || '',
        company: tripData.company || '',
        branch: tripData.branch || '',
        startDate: tripData.startDate || undefined,
        endDate: tripData.endDate || undefined,
        startKm: tripData.start_km || 0,
        endKm: null,
        destination: tripData.destination || '',
        notes: tripData.notes || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        status: 'active',
        userIds: tripData.user_ids || [],
        userRoles: tripData.user_roles || [],
        companies_data: tripData.selectedCompanies || [],
      };

      // Add optimistically to the beginning of the list
      queryClient.setQueryData<Trip[]>(['trips'], (old = []) => [optimisticTrip, ...old]);
      
      return { previousTrips, optimisticTrip };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousTrips) {
        queryClient.setQueryData(['trips'], context.previousTrips);
      }
      
      console.error('Error creating trip:', err);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la mission',
        variant: 'destructive',
      });
    },
    onSuccess: (data, variables, context) => {
      // Replace optimistic data with real data
      const realTrip = transformDatabaseToTrip(data);
      queryClient.setQueryData<Trip[]>(['trips'], (old = []) => 
        old.map(trip => 
          trip.id === context?.optimisticTrip?.id ? realTrip : trip
        )
      );

      toast({
        title: 'Succès',
        description: 'Mission créée avec succès',
      });
    }
  });

  return {
    createTrip,
    updateTrip,
    deleteTrip,
  };
};
