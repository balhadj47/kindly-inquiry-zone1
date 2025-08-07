
import { useState } from 'react';
import { Trip } from '@/contexts/TripContext';
import { useTripMutations } from '@/hooks/trips/useTripMutations';
import { TripBusinessLogic } from '@/services/tripBusinessLogic';
import { useToast } from '@/hooks/use-toast';
import { useSecurePermissions } from '@/hooks/useSecurePermissions';

export const useEndMissionFlow = () => {
  const [selectedMission, setSelectedMission] = useState<Trip | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [finalKm, setFinalKm] = useState('');
  const [isEnding, setIsEnding] = useState(false);
  
  const { updateTrip } = useTripMutations();
  const { toast } = useToast();
  const { currentUser } = useSecurePermissions();

  const initiateEndMission = (mission: Trip) => {
    setSelectedMission(mission);
    setShowConfirmation(true);
  };

  const confirmEndMission = () => {
    setShowConfirmation(false);
    setShowDialog(true);
    setFinalKm('');
  };

  const cancelEndMission = () => {
    setSelectedMission(null);
    setShowConfirmation(false);
    setShowDialog(false);
    setFinalKm('');
  };

  const validateAndEndMission = async () => {
    if (!selectedMission || !finalKm) return;

    const validation = TripBusinessLogic.validateTripTermination(
      selectedMission,
      finalKm,
      currentUser
    );

    if (!validation.isValid) {
      toast({
        title: 'Erreur de validation',
        description: validation.errorMessage,
        variant: 'destructive',
      });
      return;
    }

    const kmNumber = parseInt(finalKm, 10);
    setIsEnding(true);
    
    try {
      await updateTrip.mutateAsync({
        id: selectedMission.id.toString(),
        end_km: kmNumber,
        status: 'completed'
      });
      
      toast({
        title: 'Mission terminée',
        description: `Mission terminée avec succès au kilomètre ${kmNumber}`,
      });
      
      cancelEndMission();
    } catch (error) {
      console.error('Error ending mission:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de terminer la mission. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setIsEnding(false);
    }
  };

  return {
    selectedMission,
    showConfirmation,
    showDialog,
    finalKm,
    isEnding,
    setFinalKm,
    initiateEndMission,
    confirmEndMission,
    cancelEndMission,
    validateAndEndMission,
  };
};
