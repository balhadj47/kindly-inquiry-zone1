
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { type Trip } from '@/contexts/TripContext';
import { useTrip } from '@/contexts/TripContext';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface TripEndDialogProps {
  trip: Trip | null;
  isOpen: boolean;
  onClose: () => void;
}

const TripEndDialog: React.FC<TripEndDialogProps> = ({
  trip,
  isOpen,
  onClose
}) => {
  const { endTrip } = useTrip();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [endKmValue, setEndKmValue] = useState('');

  const getDriverInfo = (driverName: string) => {
    const roleMatch = driverName.match(/^(.+?)\s*\((.+?)\)$/);
    if (roleMatch) {
      const [, name, role] = roleMatch;
      return {
        name: name.trim(),
        role: role.trim(),
        firstName: name.trim().split(' ')[0]
      };
    }
    
    return {
      name: driverName,
      role: null,
      firstName: driverName.split(' ')[0]
    };
  };

  const getTripTitle = (trip: Trip) => {
    const driverInfo = getDriverInfo(trip.driver);
    return isMobile 
      ? `${trip.company} - ${driverInfo.firstName}`
      : `${trip.company} - ${trip.branch} - ${driverInfo.firstName}`;
  };

  const handleEndTripConfirm = async () => {
    if (!trip || !endKmValue) return;

    const endKmNumber = parseInt(endKmValue);
    
    if (isNaN(endKmNumber) || endKmNumber < 0) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une valeur de kilomètres valide",
        variant: "destructive",
      });
      return;
    }

    if (trip.startKm && endKmNumber < trip.startKm) {
      toast({
        title: "Erreur",
        description: "Les kilomètres de fin ne peuvent pas être inférieurs aux kilomètres de début",
        variant: "destructive",
      });
      return;
    }

    try {
      await endTrip(trip.id, endKmNumber);
      toast({
        title: "Succès",
        description: "Le voyage a été terminé avec succès",
      });
      onClose();
      setEndKmValue('');
    } catch (error) {
      console.error('Error ending trip:', error);
      toast({
        title: "Erreur",
        description: "Impossible de terminer le voyage",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    onClose();
    setEndKmValue('');
  };

  if (!trip) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={isMobile ? 'w-[95vw] max-w-md' : ''}>
        <DialogHeader>
          <DialogTitle className={isMobile ? 'text-base' : ''}>Terminer le voyage</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className={`${isMobile ? 'text-sm' : ''}`}>Voyage: {getTripTitle(trip)}</p>
          {trip.startKm && (
            <p className="text-xs sm:text-sm text-muted-foreground">
              Kilomètres de début: {trip.startKm.toLocaleString()} km
            </p>
          )}
          <div>
            <Label htmlFor="endKm" className={isMobile ? 'text-sm' : ''}>Kilomètres de fin</Label>
            <Input
              id="endKm"
              type="number"
              placeholder="Entrez les kilomètres de fin"
              value={endKmValue}
              onChange={(e) => setEndKmValue(e.target.value)}
              min={trip.startKm || 0}
              className={isMobile ? 'text-sm' : ''}
            />
          </div>
          <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'justify-end space-x-2'}`}>
            <Button
              variant="outline"
              onClick={handleClose}
              className={isMobile ? 'w-full text-sm' : ''}
            >
              Annuler
            </Button>
            <Button
              onClick={handleEndTripConfirm}
              className={`bg-green-600 hover:bg-green-700 ${isMobile ? 'w-full text-sm' : ''}`}
            >
              Terminer le voyage
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TripEndDialog;
