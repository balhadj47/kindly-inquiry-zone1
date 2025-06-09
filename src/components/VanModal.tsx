
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
  const { formData, handleInputChange, handleDateChange } = useVanForm(van);
  const { isSubmitting, handleSubmit } = useVanSubmit(van, onClose, onSaveSuccess);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {van ? t.editVan : t.addNewVan}
          </DialogTitle>
          <DialogDescription>
            {van ? 'Modifiez les informations de la camionnette' : 'Ajoutez une nouvelle camionnette à votre flotte'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
          <VanFormFields
            formData={formData}
            onInputChange={handleInputChange}
            onDateChange={handleDateChange}
          />

          <VanFormActions
            isSubmitting={isSubmitting}
            isEditing={!!van}
            onCancel={onClose}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VanModal;
