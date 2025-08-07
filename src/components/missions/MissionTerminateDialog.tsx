
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trip } from '@/contexts/TripContext';
import { CheckCircle, Loader2 } from 'lucide-react';

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && finalKm && !isTerminating) {
      onSubmit();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <DialogTitle className="text-left">
                Finaliser la mission
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="space-y-2 text-sm">
              <div><span className="font-medium text-blue-900">Entreprise:</span> <span className="text-blue-800">{mission.company}</span></div>
              <div><span className="font-medium text-blue-900">Agence:</span> <span className="text-blue-800">{mission.branch}</span></div>
              {mission.start_km && (
                <div><span className="font-medium text-blue-900">Km initial:</span> <span className="text-blue-800">{mission.start_km} km</span></div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="finalKm" className="text-sm font-medium text-gray-900">
              Kilométrage final du véhicule *
            </Label>
            <Input
              id="finalKm"
              type="number"
              placeholder="Entrez le kilométrage final"
              value={finalKm}
              onChange={(e) => onFinalKmChange(e.target.value)}
              onKeyPress={handleKeyPress}
              min={mission.start_km || 0}
              className="text-base"
              autoFocus
              disabled={isTerminating}
            />
            {mission.start_km && (
              <p className="text-xs text-gray-500">
                Doit être supérieur à {mission.start_km} km
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isTerminating}
            >
              Annuler
            </Button>
            <Button
              onClick={onSubmit}
              disabled={!finalKm || isTerminating}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isTerminating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Finalisation...
                </>
              ) : (
                'Terminer la mission'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MissionTerminateDialog;
