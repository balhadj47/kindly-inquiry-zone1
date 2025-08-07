
import { useState } from 'react';
import { useTrip } from '@/contexts/TripContext';
import { useTripMutationsOptimized } from '@/hooks/trips/useTripMutationsOptimized';
import { useToast } from '@/hooks/use-toast';
import { Trip } from '@/contexts/TripContext';

interface ActionDialog {
  isOpen: boolean;
  mission: Trip | null;
  action: 'delete' | 'terminate' | null;
}

export const useMissionsActionsOptimized = () => {
  const [actionDialog, setActionDialog] = useState<ActionDialog>({
    isOpen: false,
    mission: null,
    action: null
  });

  const { endTrip } = useTrip();
  const { deleteTrip: mutationDeleteTrip, updateTrip } = useTripMutationsOptimized();
  const { toast } = useToast();

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

    try {
      if (actionDialog.action === 'delete') {
        // Use optimistic delete - card will disappear immediately
        await mutationDeleteTrip.mutateAsync(actionDialog.mission.id.toString());
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

        // Use optimistic update - card will update immediately
        await updateTrip.mutateAsync({
          id: actionDialog.mission.id.toString(),
          end_km: finalKmNumber,
          status: 'completed'
        });
      }
    } catch (error) {
      console.error('Error in action confirm:', error);
    } finally {
      setActionDialog({ isOpen: false, mission: null, action: null });
    }
  };

  return {
    actionDialog,
    setActionDialog,
    handleDeleteMission,
    handleTerminateMission,
    handleActionConfirm,
    isLoading: mutationDeleteTrip.isPending || updateTrip.isPending
  };
};
