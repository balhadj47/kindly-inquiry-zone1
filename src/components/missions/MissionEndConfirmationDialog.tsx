
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { Trip } from '@/contexts/TripContext';

interface MissionEndConfirmationDialogProps {
  mission: Trip | null;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const MissionEndConfirmationDialog: React.FC<MissionEndConfirmationDialogProps> = ({
  mission,
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!mission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <DialogTitle className="text-left">
                Terminer la mission
              </DialogTitle>
              <DialogDescription className="text-left mt-1">
                Êtes-vous sûr de vouloir terminer cette mission ?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Entreprise:</span> {mission.company}</div>
            <div><span className="font-medium">Agence:</span> {mission.branch}</div>
            <div><span className="font-medium">Véhicule:</span> {mission.van}</div>
            {mission.start_km && (
              <div><span className="font-medium">Km initial:</span> {mission.start_km} km</div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-orange-600 hover:bg-orange-700"
          >
            Continuer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MissionEndConfirmationDialog;
