
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface VanFormActionsProps {
  isSubmitting: boolean;
  isEditing: boolean;
  onCancel: () => void;
}

const VanFormActions = ({ isSubmitting, isEditing, onCancel }: VanFormActionsProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col-reverse lg:flex-row justify-end gap-2 lg:gap-0 lg:space-x-2 pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        className="w-full lg:w-auto touch-manipulation"
        size="lg"
        disabled={isSubmitting}
      >
        {t.cancel}
      </Button>
      <Button 
        type="submit"
        className="w-full lg:w-auto touch-manipulation"
        size="lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? t.saving : (isEditing ? t.updateVan : t.createVan)}
      </Button>
    </div>
  );
};

export default VanFormActions;
