
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVanForm } from '@/hooks/useVanForm';
import { useVanSubmit } from '@/hooks/useVanSubmit';
import VanFormFields from './VanFormFields';
import VanFormActions from './VanFormActions';

interface VanModalProps {
  isOpen: boolean;
  onClose: () => void;
  van: any;
  onSaveSuccess?: () => void;
}

const VanModal = ({ isOpen, onClose, van, onSaveSuccess }: VanModalProps) => {
  const { t } = useLanguage();
  
  // Add debugging
  console.log('🚐 VanModal: Received props:', { isOpen, van: van ? { id: van.id, reference_code: van.reference_code } : null });
  
  const { formData, handleInputChange, handleDateChange } = useVanForm(van);
  const { isSubmitting, handleSubmit } = useVanSubmit(van, onClose, onSaveSuccess);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚐 VanModal: Submitting form with data:', formData);
    console.log('🚐 VanModal: Van being edited:', van);
    await handleSubmit(formData);
  };

  const isEditing = !!(van && van.id);
  console.log('🚐 VanModal: Is editing mode:', isEditing);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[900px] max-h-[95vh] p-0 fixed top-[2.5vh] left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex flex-col h-full max-h-[95vh]">
          <div className="p-4 sm:p-6 flex-shrink-0">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl font-semibold">
                {isEditing ? t.editVan : t.addNewVan}
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-base text-muted-foreground">
                {isEditing ? 'Modifiez les informations de la camionnette' : 'Ajoutez une nouvelle camionnette à votre flotte'}
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="flex-1 overflow-y-auto px-4 sm:px-6">
            <form onSubmit={onSubmit} className="space-y-4 pb-4 sm:pb-6">
              <VanFormFields
                formData={formData}
                onInputChange={handleInputChange}
                onDateChange={handleDateChange}
              />

              <VanFormActions
                isSubmitting={isSubmitting}
                isEditing={isEditing}
                onCancel={onClose}
              />
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VanModal;
