
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  if (!isOpen || !mission) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-[5vh]">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Terminer la Mission</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Mission: <span className="font-medium">{mission.company}</span>
            </p>
            {mission.start_km && (
              <p className="text-sm text-gray-600 mb-4">
                Kilométrage initial: {mission.start_km} km
              </p>
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
              {isTerminating ? 'Finalisation...' : 'Confirmer'}
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionTerminateDialog;
