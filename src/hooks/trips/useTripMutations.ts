
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trip } from '@/types/trip';

export const useTripMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const invalidateTrips = () => {
    queryClient.invalidateQueries({ queryKey: ['trips'] });
    // Also invalidate vans to refresh the status
    queryClient.invalidateQueries({ queryKey: ['vans'] });
  };

  const createTrip = useMutation({
    mutationFn: async (tripData: Partial<Trip>) => {
      // Insert trip
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
      const numericId = parseInt(id, 10);
      
      // Get current trip data to find the van
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

      // If trip is being completed (end_km is provided), update van status to Active
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
      const numericId = parseInt(tripId, 10);
      
      // Get trip data to find the van
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
