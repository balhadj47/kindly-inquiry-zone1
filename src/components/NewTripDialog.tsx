
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TripFormProvider } from './trip-logger/TripFormProvider';
import { TripFormWizardMultiCompany } from './trip-logger/TripFormWizardMultiCompany';
import { TripMultiCompanyProvider } from '@/contexts/TripContextMultiCompany';

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
      <DialogContent className="w-[95vw] max-w-[900px] max-h-[90vh] overflow-y-auto p-4 sm:p-6 fixed left-[50%] top-[5%] translate-x-[-50%] translate-y-0">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-lg sm:text-2xl font-bold text-center">
            Créer une Nouvelle Mission
          </DialogTitle>
        </DialogHeader>
        
        <TripMultiCompanyProvider>
          <TripFormProvider>
            <div className="p-2">
              <TripFormWizardMultiCompany onSuccess={handleSuccess} />
            </div>
          </TripFormProvider>
        </TripMultiCompanyProvider>
      </DialogContent>
    </Dialog>
  );
};

export default NewTripDialog;
