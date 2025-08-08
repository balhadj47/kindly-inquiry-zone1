
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trip } from '@/contexts/TripContext';
import { vanRefreshService } from '@/services/vanRefreshService';
import { transformDatabaseToTrip } from '../utils/tripTransforms';

export const useTripUpdateMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...tripData }: { id: string; [key: string]: any }) => {
      console.log('🚗 Updating trip:', id, tripData);
      const numericId = parseInt(id, 10);
      
      // If we're completing a trip (setting end_km and status to completed)
      if (tripData.status === 'completed' && tripData.end_km) {
        console.log('🚗 Trip being completed, will update van status to Actif');
        
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

        console.log('🚗 Retrieved trip info:', tripInfo);

        // Update the trip first
        const { data, error } = await supabase
          .from('trips')
          .update(tripData)
          .eq('id', numericId)
          .select()
          .single();

        if (error) throw error;

        console.log('🚗 Trip updated successfully:', data);

        // Update van status back to "Actif" after successful trip update
        if (tripInfo?.van) {
          console.log('🚐 Setting van status to Actif for van:', tripInfo.van);
          
          const { data: updatedVan, error: vanError } = await supabase
            .from('vans')
            .update({ status: 'Actif' })
            .eq('id', tripInfo.van)
            .select()
            .single();

          if (vanError) {
            console.error('❌ Error updating van status to Actif:', vanError);
            throw vanError; // Throw error to prevent trip completion if van update fails
          } else {
            console.log('✅ Van status successfully updated to Actif:', updatedVan);
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
      
      console.error('❌ Error updating trip:', err);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour la mission',
        variant: 'destructive',
      });
    },
    onSuccess: async (data, variables) => {
      // Update with real data from server
      const realTrip = transformDatabaseToTrip(data);
      queryClient.setQueryData<Trip[]>(['trips'], (old = []) =>
        old.map(trip => trip.id === realTrip.id ? realTrip : trip)
      );

      // If this was a trip completion, force refresh van data immediately
      if (variables.status === 'completed') {
        console.log('🚗 Mission completed - forcing immediate van refresh');
        
        // Use the refresh service for immediate van data update
        await vanRefreshService.forceRefreshVans();
        
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
};
