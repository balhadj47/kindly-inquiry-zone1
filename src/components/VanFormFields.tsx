
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { VanFormData } from '@/hooks/useVanForm';

interface VanFormFieldsProps {
  formData: VanFormData;
  onInputChange: (field: keyof VanFormData, value: any) => void;
  onDateChange: (field: string, date: Date | undefined) => void;
}

const VanFormFields = ({ formData, onInputChange }: VanFormFieldsProps) => {
  const { t } = useLanguage();

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="plate-number" className="text-sm sm:text-base">{t.plateNumber}</Label>
        <Input
          id="plate-number"
          value={formData.plateNumber}
          onChange={(e) => onInputChange('plateNumber', e.target.value)}
          placeholder="e.g., VAN-001"
          className="text-base touch-manipulation"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="model" className="text-sm sm:text-base">{t.vanModel}</Label>
        <Input
          id="model"
          value={formData.model}
          onChange={(e) => onInputChange('model', e.target.value)}
          placeholder="e.g., Ford Transit"
          className="text-base touch-manipulation"
          required
        />
      </div>
    </>
  );
};

export default VanFormFields;
