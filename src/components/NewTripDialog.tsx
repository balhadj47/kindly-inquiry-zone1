
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TripFormProviderDialog } from './trip-logger/TripFormProviderDialog';
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
  
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            Créer une Nouvelle Mission
          </DialogTitle>
        </DialogHeader>
        
        <TripFormProviderDialog onSuccess={handleClose}>
          <div className="p-2">
            <TripFormWizard />
          </div>
        </TripFormProviderDialog>
      </DialogContent>
    </Dialog>
  );
};

export default NewTripDialog;
