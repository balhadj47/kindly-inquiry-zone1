
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
      <DialogContent className="w-[95vw] max-w-[900px] p-0">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {van ? t.editVan : t.addNewVan}
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              {van ? 'Modifiez les informations de la camionnette' : 'Ajoutez une nouvelle camionnette à votre flotte'}
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <form onSubmit={onSubmit} className="px-6 pb-6">
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
