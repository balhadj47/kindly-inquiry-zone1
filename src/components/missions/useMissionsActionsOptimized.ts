
import { useState } from 'react';
import { useTrip } from '@/contexts/TripContext';
import { useTripMutationsOptimized } from '@/hooks/trips/useTripMutationsOptimized';
import { useToast } from '@/hooks/use-toast';
import { Trip } from '@/contexts/TripContext';

export const useMissionsActionsOptimized = () => {
  const { endTrip } = useTrip();
  const { deleteTrip: mutationDeleteTrip, updateTrip } = useTripMutationsOptimized();
  const { toast } = useToast();

  const handleDeleteMission = async (mission: Trip) => {
    try {
      // Use optimistic delete - card will disappear immediately
      await mutationDeleteTrip.mutateAsync(mission.id.toString());
    } catch (error) {
      console.error('Error deleting mission:', error);
    }
  };

  const handleTerminateMission = async (mission: Trip, finalKm: number) => {
    try {
      if (isNaN(finalKm) || finalKm < 0) {
        toast({
          title: 'Erreur',
          description: 'Veuillez saisir un kilométrage valide',
          variant: 'destructive',
        });
        return;
      }

      if (mission.start_km && finalKm < mission.start_km) {
        toast({
          title: 'Erreur',
          description: 'Le kilométrage final ne peut pas être inférieur au kilométrage initial',
          variant: 'destructive',
        });
        return;
      }

      // Use optimistic update - card will update immediately
      await updateTrip.mutateAsync({
        id: mission.id.toString(),
        end_km: finalKm,
        status: 'completed'
      });
    } catch (error) {
      console.error('Error terminating mission:', error);
    }
  };

  return {
    handleDeleteMission,
    handleTerminateMission,
    isLoading: mutationDeleteTrip.isPending || updateTrip.isPending
  };
};
