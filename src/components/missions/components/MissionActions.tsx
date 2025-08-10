
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trip } from '@/contexts/TripContext';
import { useTripMutations } from '@/hooks/trips/useTripMutations';
import { useToast } from '@/hooks/use-toast';
import { TripBusinessLogic } from '@/services/tripBusinessLogic';

interface MissionActionsProps {
  mission: Trip;
  onClose: () => void;
}

const MissionActions: React.FC<MissionActionsProps> = ({ mission, onClose }) => {
  const [showCompleteForm, setShowCompleteForm] = useState(false);
  const [finalKm, setFinalKm] = useState('');
  const [isCompleting, setIsCompleting] = useState(false);
  
  const { updateTrip } = useTripMutations();
  const { toast } = useToast();

  const handleCompleteMission = async () => {
    const validation = TripBusinessLogic.validateTripTermination(mission, finalKm, null);
    
    if (!validation.isValid) {
      toast({
        title: 'Erreur',
        description: validation.errorMessage,
        variant: 'destructive',
      });
      return;
    }

    const kmNumber = parseInt(finalKm, 10);
    setIsCompleting(true);
    
    try {
      console.log('🎯 Completing mission with data:', {
        id: mission.id,
        end_km: kmNumber,
        status: 'completed'
      });
      
      await updateTrip.mutateAsync({
        id: mission.id.toString(),
        end_km: kmNumber,
        status: 'completed'
      });
      
      toast({
        title: 'Succès',
        description: 'Mission terminée avec succès',
      });
      
      setShowCompleteForm(false);
      setFinalKm('');
      onClose();
    } catch (error) {
      console.error('Error completing mission:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de terminer la mission',
        variant: 'destructive',
      });
    } finally {
      setIsCompleting(false);
    }
  };

  if (mission.status === 'completed') {
    return null;
  }

  return (
    <div className="border-t pt-6 mt-6">
      {!showCompleteForm ? (
        <div className="flex justify-end">
          <Button 
            onClick={() => setShowCompleteForm(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            Terminer la mission
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Terminer la mission</h3>
          <div className="space-y-2">
            <Label htmlFor="finalKm">Kilométrage final</Label>
            <Input
              id="finalKm"
              type="number"
              value={finalKm}
              onChange={(e) => setFinalKm(e.target.value)}
              placeholder="Entrez le kilométrage final"
              min={mission.start_km || 0}
            />
            {mission.start_km && (
              <p className="text-sm text-gray-600">
                Kilométrage initial: {mission.start_km} km
              </p>
            )}
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowCompleteForm(false);
                setFinalKm('');
              }}
              disabled={isCompleting}
            >
              Annuler
            </Button>
            <Button
              onClick={handleCompleteMission}
              disabled={isCompleting || !finalKm}
              className="bg-green-600 hover:bg-green-700"
            >
              {isCompleting ? 'Traitement...' : 'Confirmer'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionActions;
