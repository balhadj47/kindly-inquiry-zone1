
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
  onSubmit: () => void;
}

const MissionTerminateDialog: React.FC<MissionTerminateDialogProps> = ({
  isOpen,
  mission,
  finalKm,
  isTerminating,
  onClose,
  onFinalKmChange,
  onSubmit,
}) => {
  if (!mission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Terminer la Mission</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium text-muted-foreground">Société:</span>
              <span className="ml-2">{mission.company}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-muted-foreground">Succursale:</span>
              <span className="ml-2">{mission.branch}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-muted-foreground">Conducteur:</span>
              <span className="ml-2">{mission.driver}</span>
            </div>
            {mission.start_km && (
              <div className="text-sm">
                <span className="font-medium text-muted-foreground">Kilométrage initial:</span>
                <span className="ml-2">{mission.start_km} km</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="finalKm" className="text-gray-700 font-medium">
              Kilométrage Final du Véhicule
            </Label>
            <Input
              id="finalKm"
              type="number"
              placeholder="Entrez le kilométrage final"
              value={finalKm}
              onChange={(e) => onFinalKmChange(e.target.value)}
              className="mt-2"
              min={mission.start_km || 0}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={onSubmit}
              disabled={!finalKm || isTerminating}
              className="flex-1"
            >
              {isTerminating ? 'Finalisation...' : 'Terminer la Mission'}
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MissionTerminateDialog;
