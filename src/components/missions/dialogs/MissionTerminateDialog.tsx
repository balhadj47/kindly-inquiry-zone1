
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Trip } from '@/contexts/TripContext';

interface MissionTerminateDialogProps {
  isOpen: boolean;
  mission: Trip | null;
  finalKm: string;
  isTerminating: boolean;
  onClose: () => void;
  onFinalKmChange: (value: string) => void;
  onConfirm: () => void;
}

const MissionTerminateDialog: React.FC<MissionTerminateDialogProps> = ({
  isOpen,
  mission,
  finalKm,
  isTerminating,
  onClose,
  onFinalKmChange,
  onConfirm,
}) => {
  if (!mission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Terminer la Mission</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <p className="mb-2">
              Mission: <span className="font-medium">{mission.company}</span>
            </p>
            {(mission.start_km || mission.startKm) && (
              <p className="text-sm text-gray-500">
                Kilométrage initial: {mission.start_km || mission.startKm} km
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="finalKm">
              Kilométrage Final du Véhicule
            </Label>
            <Input
              id="finalKm"
              type="number"
              placeholder="Entrez le kilométrage final"
              value={finalKm}
              onChange={(e) => onFinalKmChange(e.target.value)}
              min={mission.start_km || mission.startKm || 0}
              disabled={isTerminating}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isTerminating}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={onConfirm}
              disabled={!finalKm || isTerminating}
              className="flex-1"
            >
              {isTerminating ? 'Finalisation...' : 'Confirmer'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MissionTerminateDialog;
