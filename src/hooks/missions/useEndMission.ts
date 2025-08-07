
import { useState } from 'react';
import { useTripMutations } from '@/hooks/trips/useTripMutations';
import { TripBusinessLogic } from '@/services/tripBusinessLogic';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Trip } from '@/contexts/TripContext';

export const useEndMission = () => {
  const [isTerminating, setIsTerminating] = useState(false);
  const [finalKm, setFinalKm] = useState('');
  const [selectedMission, setSelectedMission] = useState<Trip | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { updateTrip } = useTripMutations();
  const { user } = useAuth();
  const { toast } = useToast();

  const openTerminateDialog = (mission: Trip) => {
    setSelectedMission(mission);
    setFinalKm('');
    setIsDialogOpen(true);
  };

  const closeTerminateDialog = () => {
    setSelectedMission(null);
    setFinalKm('');
    setIsDialogOpen(false);
  };

  const validateTermination = (mission: Trip, finalKmValue: string) => {
    return TripBusinessLogic.validateTripTermination(mission, finalKmValue, null);
  };

  const canTerminate = (mission: Trip) => {
    return TripBusinessLogic.canTerminateTrip(mission, null);
  };

  const handleTerminate = async () => {
    if (!selectedMission || !finalKm) return;

    const validation = validateTermination(selectedMission, finalKm);
    if (!validation.isValid) {
      toast({
        title: 'Erreur',
        description: validation.errorMessage,
        variant: 'destructive',
      });
      return;
    }

    setIsTerminating(true);
    try {
      await updateTrip.mutateAsync({
        id: selectedMission.id.toString(),
        end_km: parseInt(finalKm),
        status: 'completed'
      });

      closeTerminateDialog();
      
      toast({
        title: 'Succès',
        description: 'Mission terminée avec succès',
      });
    } catch (error) {
      console.error('Error terminating mission:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de terminer la mission',
        variant: 'destructive',
      });
    } finally {
      setIsTerminating(false);
    }
  };

  return {
    // State
    isTerminating,
    finalKm,
    selectedMission,
    isDialogOpen,
    
    // Actions
    openTerminateDialog,
    closeTerminateDialog,
    setFinalKm,
    handleTerminate,
    
    // Validation
    canTerminate,
    validateTermination,
  };
};
