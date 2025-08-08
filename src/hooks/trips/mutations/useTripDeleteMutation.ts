
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trip } from '@/contexts/TripContext';
import { vanRefreshService } from '@/services/vanRefreshService';

export const useTripDeleteMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
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

      console.log('🚗 Trip to delete:', tripInfo);

      // Delete the trip
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', numericId);

      if (error) throw error;

      // If the trip was active, update van status back to "Actif"
      if (tripInfo?.van && tripInfo?.status === 'active') {
        console.log('🚐 Setting van status to Actif after trip deletion for van:', tripInfo.van);
        
        const { data: updatedVan, error: vanError } = await supabase
          .from('vans')
          .update({ status: 'Actif' })
          .eq('id', tripInfo.van)
          .select()
          .single();

        if (vanError) {
          console.error('❌ Error updating van status to Actif:', vanError);
          throw vanError; // Throw error to prevent deletion completion if van update fails
        } else {
          console.log('✅ Van status successfully updated to Actif after deletion:', updatedVan);
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
      
      console.error('❌ Error deleting trip:', err);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la mission',
        variant: 'destructive',
      });
    },
    onSuccess: async () => {
      console.log('🚗 Mission deleted - forcing immediate van refresh');
      
      // Use the refresh service for immediate van data update
      await vanRefreshService.forceRefreshVans();

      toast({
        title: 'Succès',
        description: 'Mission supprimée avec succès, le véhicule est maintenant disponible',
      });
    }
  });
};
