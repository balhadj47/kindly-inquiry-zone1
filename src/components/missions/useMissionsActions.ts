
import { useState } from 'react';
import { useTrip } from '@/contexts/TripContext';
import { useTripMutations } from '@/hooks/trips/useTripMutations';
import { useToast } from '@/hooks/use-toast';
import { Trip } from '@/contexts/TripContext';

interface ActionDialog {
  isOpen: boolean;
  mission: Trip | null;
  action: 'delete' | 'terminate' | null;
}

export const useMissionsActions = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionDialog, setActionDialog] = useState<ActionDialog>({
    isOpen: false,
    mission: null,
    action: null
  });

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

  const handleDeleteMission = (mission: Trip) => {
    setActionDialog({
      isOpen: true,
      mission,
      action: 'delete'
    });
  };

  const handleTerminateMission = (mission: Trip) => {
    setActionDialog({
      isOpen: true,
      mission,
      action: 'terminate'
    });
  };

  const handleActionConfirm = async (finalKm?: string) => {
    if (!actionDialog.mission || !actionDialog.action) return;

    setIsRefreshing(true);
    try {
      if (actionDialog.action === 'delete') {
        await contextDeleteTrip(actionDialog.mission.id);
      } else if (actionDialog.action === 'terminate' && finalKm) {
        const finalKmNumber = parseInt(finalKm);
        
        if (isNaN(finalKmNumber) || finalKmNumber < 0) {
          toast({
            title: 'Erreur',
            description: 'Veuillez saisir un kilométrage valide',
            variant: 'destructive',
          });
          return;
        }

        if (actionDialog.mission.start_km && finalKmNumber < actionDialog.mission.start_km) {
          toast({
            title: 'Erreur',
            description: 'Le kilométrage final ne peut pas être inférieur au kilométrage initial',
            variant: 'destructive',
          });
          return;
        }

        await endTrip(actionDialog.mission.id, finalKmNumber);
      }
      
      await handleRefresh();
    } catch (error) {
      console.error('Error in action confirm:', error);
    } finally {
      setIsRefreshing(false);
      setActionDialog({ isOpen: false, mission: null, action: null });
    }
  };

  return {
    isRefreshing,
    actionDialog,
    setActionDialog,
    handleRefresh,
    handleDeleteMission,
    handleTerminateMission,
    handleActionConfirm
  };
};
