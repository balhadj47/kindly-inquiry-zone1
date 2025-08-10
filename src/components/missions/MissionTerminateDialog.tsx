
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trip } from '@/contexts/TripContext';
import { TripBusinessLogic } from '@/services/tripBusinessLogic';
import { useToast } from '@/hooks/use-toast';

interface MissionTerminateDialogProps {
  mission: Trip | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (mission: Trip, finalKm: number) => Promise<void>;
  isLoading?: boolean;
}

const MissionTerminateDialog: React.FC<MissionTerminateDialogProps> = ({
  mission,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false
}) => {
  const [finalKm, setFinalKm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleConfirm = async () => {
    if (!mission) return;

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
    setIsSubmitting(true);
    
    try {
      await onConfirm(mission, kmNumber);
      setFinalKm('');
      onClose();
    } catch (error) {
      console.error('Error terminating mission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFinalKm('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Terminer la mission</DialogTitle>
          <DialogDescription>
            Veuillez saisir le kilométrage final pour terminer cette mission.
          </DialogDescription>
        </DialogHeader>
        
        {mission && (
          <div className="space-y-4 py-4">
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
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting || isLoading}
          >
            Annuler
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isSubmitting || isLoading || !finalKm}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {isSubmitting ? 'Traitement...' : 'Terminer la mission'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MissionTerminateDialog;
