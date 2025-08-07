
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trip } from '@/contexts/TripContext';

interface MissionActionDialogProps {
  mission: Trip | null;
  action: 'delete' | 'terminate' | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (finalKm?: string) => void;
  isLoading?: boolean;
}

const MissionActionDialog: React.FC<MissionActionDialogProps> = ({
  mission,
  action,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false
}) => {
  const [finalKm, setFinalKm] = useState('');

  if (!mission || !action) return null;

  const isDelete = action === 'delete';
  const isTerminate = action === 'terminate';

  const handleConfirm = () => {
    if (isTerminate) {
      onConfirm(finalKm);
    } else {
      onConfirm();
    }
  };

  const handleClose = () => {
    setFinalKm('');
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="fixed left-[50%] top-[5%] translate-x-[-50%] translate-y-0">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isDelete ? 'Supprimer la Mission' : 'Terminer la Mission'}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <div>
                {isDelete ? (
                  <>
                    Êtes-vous sûr de vouloir supprimer cette mission pour{' '}
                    <strong>{mission.company} - {mission.branch}</strong>?
                    <br />
                    Cette action est irréversible.
                  </>
                ) : (
                  <>
                    Êtes-vous sûr de vouloir terminer cette mission?
                    <br />
                    Le statut de la mission passera à "Terminé".
                  </>
                )}
              </div>

              {isTerminate && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Société:</span>
                      <span className="ml-2 text-foreground">{mission.company}</span>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Succursale:</span>
                      <span className="ml-2 text-foreground">{mission.branch}</span>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Conducteur:</span>
                      <span className="ml-2 text-foreground">{mission.driver}</span>
                    </div>
                    {mission.start_km && (
                      <div>
                        <span className="font-medium text-muted-foreground">Kilométrage initial:</span>
                        <span className="ml-2 text-foreground">{mission.start_km} km</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="finalKm" className="text-foreground font-medium">
                      Kilométrage Final du Véhicule
                    </Label>
                    <Input
                      id="finalKm"
                      type="number"
                      placeholder="Entrez le kilométrage final"
                      value={finalKm}
                      onChange={(e) => setFinalKm(e.target.value)}
                      className="mt-2"
                      min={mission.start_km || 0}
                    />
                  </div>
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading || (isTerminate && !finalKm)}
            className={isDelete ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'}
          >
            {isLoading ? 'En cours...' : (isDelete ? 'Supprimer' : 'Terminer')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MissionActionDialog;
