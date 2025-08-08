
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trip } from '@/contexts/TripContext';
import { vanRefreshService } from '@/services/vanRefreshService';
import { transformDatabaseToTrip } from '../utils/tripTransforms';

export const useTripCreateMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (tripData: any) => {
      console.log('🚗 Creating trip with van:', tripData.van);
      
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

      // Update van status to "En Transit" after successful trip creation
      if (tripData.van) {
        console.log('🚐 Setting van status to En Transit for van:', tripData.van);
        const { error: vanError } = await supabase
          .from('vans')
          .update({ status: 'En Transit' })
          .eq('id', tripData.van);

        if (vanError) {
          console.error('❌ Error updating van status to En Transit:', vanError);
          throw vanError; // Throw error to prevent trip creation if van update fails
        } else {
          console.log('✅ Van status successfully updated to En Transit');
        }
      }

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
      
      console.error('❌ Error creating trip:', err);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la mission',
        variant: 'destructive',
      });
    },
    onSuccess: async (data, variables, context) => {
      // Replace optimistic data with real data
      const realTrip = transformDatabaseToTrip(data);
      queryClient.setQueryData<Trip[]>(['trips'], (old = []) => 
        old.map(trip => 
          trip.id === context?.optimisticTrip?.id ? realTrip : trip
        )
      );

      console.log('🚗 Mission created - forcing immediate van refresh');
      
      // Use the refresh service for immediate van data update
      await vanRefreshService.forceRefreshVans();

      toast({
        title: 'Succès',
        description: 'Mission créée avec succès',
      });
    }
  });
};
