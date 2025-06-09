
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
    <div className="flex flex-col sm:flex-row justify-end gap-3 sm:space-x-2 pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        className="order-2 sm:order-1 touch-manipulation"
        size="lg"
        disabled={isSubmitting}
      >
        {t.cancel}
      </Button>
      <Button 
        type="submit"
        className="order-1 sm:order-2 touch-manipulation"
        size="lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Enregistrement...' : (isEditing ? t.updateVan : t.createVan)}
      </Button>
    </div>
  );
};

export default VanFormActions;
