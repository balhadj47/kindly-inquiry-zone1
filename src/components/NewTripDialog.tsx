
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TripFormProvider } from './trip-logger/TripFormProvider';
import { TripFormWizard } from './trip-logger/TripFormWizard';

interface NewTripDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewTripDialog: React.FC<NewTripDialogProps> = ({ isOpen, onClose }) => {
  const handleClose = () => {
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    }
  };

  const handleSuccess = () => {
    handleClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[95vw] max-w-[900px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-lg sm:text-2xl font-bold text-center">
            Créer une Nouvelle Mission
          </DialogTitle>
        </DialogHeader>
        
        <TripFormProvider>
          <div className="p-2">
            <TripFormWizard onSuccess={handleSuccess} />
          </div>
        </TripFormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default NewTripDialog;
