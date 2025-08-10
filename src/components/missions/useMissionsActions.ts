
import { useState } from 'react';
import { useTrip } from '@/contexts/TripContext';
import { useTripMutations } from '@/hooks/trips/useTripMutations';
import { useToast } from '@/hooks/use-toast';
import { Trip } from '@/contexts/TripContext';

export const useMissionsActions = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { refreshTrips, deleteTrip: contextDeleteTrip, endTrip } = useTrip();
  const { deleteTrip: mutationDeleteTrip, updateTrip } = useTripMutations();
  const { toast } = useToast();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshTrips();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDeleteMission = async (mission: Trip) => {
    setIsRefreshing(true);
    try {
      await contextDeleteTrip(mission.id);
      await handleRefresh();
    } catch (error) {
      console.error('Error deleting mission:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleTerminateMission = async (mission: Trip, finalKm: number) => {
    setIsRefreshing(true);
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

      await endTrip(mission.id, finalKm);
      await handleRefresh();
    } catch (error) {
      console.error('Error terminating mission:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    isRefreshing,
    handleRefresh,
    handleDeleteMission,
    handleTerminateMission
  };
};
