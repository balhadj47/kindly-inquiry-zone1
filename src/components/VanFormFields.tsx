
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { VanFormData } from '@/hooks/useVanForm';

interface VanFormFieldsProps {
  formData: VanFormData;
  onInputChange: (field: keyof VanFormData, value: any) => void;
  onDateChange: (field: string, date: Date | undefined) => void;
}

const VanFormFields = ({ formData, onInputChange, onDateChange }: VanFormFieldsProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm sm:text-base">Statut</Label>
          <Select value={formData.status} onValueChange={(value) => onInputChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Actif</SelectItem>
              <SelectItem value="En Transit">En Transit</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
              <SelectItem value="Inactive">Inactif</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="insurer" className="text-sm sm:text-base">Assureur</Label>
          <Input
            id="insurer"
            value={formData.insurer}
            onChange={(e) => onInputChange('insurer', e.target.value)}
            placeholder="e.g., AXA, Allianz"
            className="text-base touch-manipulation"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm sm:text-base">Date d'assurance</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.insuranceDate ? (
                  format(formData.insuranceDate, "PPP")
                ) : (
                  <span>Sélectionner une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.insuranceDate}
                onSelect={(date) => onDateChange('insuranceDate', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label className="text-sm sm:text-base">Date de contrôle</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.controlDate ? (
                  format(formData.controlDate, "PPP")
                ) : (
                  <span>Sélectionner une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.controlDate}
                onSelect={(date) => onDateChange('controlDate', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm sm:text-base">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => onInputChange('notes', e.target.value)}
          placeholder="Ajouter des notes ou commentaires..."
          className="text-base touch-manipulation min-h-[100px]"
        />
      </div>
    </div>
  );
};

export default VanFormFields;
