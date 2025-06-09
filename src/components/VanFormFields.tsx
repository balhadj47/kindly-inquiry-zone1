
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { VanFormData } from '@/hooks/useVanForm';

interface VanFormFieldsProps {
  formData: VanFormData;
  onInputChange: (field: keyof VanFormData, value: any) => void;
  onDateChange: (field: 'insuranceDate' | 'controlDate', date: Date | undefined) => void;
}

const VanFormFields = ({ formData, onInputChange, onDateChange }: VanFormFieldsProps) => {
  const { t } = useLanguage();

  return (
    <>
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
          <Label htmlFor="car-number-plate" className="text-sm sm:text-base">{t.carNumberPlate}</Label>
          <Input
            id="car-number-plate"
            value={formData.carNumberPlate}
            onChange={(e) => onInputChange('carNumberPlate', e.target.value)}
            placeholder="e.g., ABC-123"
            className="text-base touch-manipulation"
          />
          <p className="text-xs text-gray-500">Note: Ce champ n'est pas sauvegardé dans la base de données</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm sm:text-base">{t.status}</Label>
          <Select value={formData.status} onValueChange={(value) => onInputChange('status', value)}>
            <SelectTrigger className="text-base touch-manipulation">
              <SelectValue placeholder={t.selectStatus} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">{t.vanStatuses?.active || 'Active'}</SelectItem>
              <SelectItem value="In Transit">{t.vanStatuses?.inTransit || 'In Transit'}</SelectItem>
              <SelectItem value="Maintenance">{t.vanStatuses?.maintenance || 'Maintenance'}</SelectItem>
              <SelectItem value="Inactive">{t.vanStatuses?.inactive || 'Inactive'}</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">Note: Ce champ n'est pas sauvegardé dans la base de données</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="insurer" className="text-sm sm:text-base">{t.insurer}</Label>
        <Input
          id="insurer"
          value={formData.insurer}
          onChange={(e) => onInputChange('insurer', e.target.value)}
          placeholder="e.g., AXA Insurance"
          className="text-base touch-manipulation"
        />
        <p className="text-xs text-gray-500">Note: Ce champ n'est pas sauvegardé dans la base de données</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm sm:text-base">{t.insuranceDate}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal text-base touch-manipulation",
                  !formData.insuranceDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.insuranceDate ? format(formData.insuranceDate, "PPP") : <span>{t.pickInsuranceDate}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.insuranceDate}
                onSelect={(date) => onDateChange('insuranceDate', date)}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <p className="text-xs text-gray-500">Note: Ce champ n'est pas sauvegardé dans la base de données</p>
        </div>

        <div className="space-y-2">
          <Label className="text-sm sm:text-base">{t.controlDate}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal text-base touch-manipulation",
                  !formData.controlDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.controlDate ? format(formData.controlDate, "PPP") : <span>{t.pickControlDate}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.controlDate}
                onSelect={(date) => onDateChange('controlDate', date)}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <p className="text-xs text-gray-500">Note: Ce champ n'est pas sauvegardé dans la base de données</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm sm:text-base">{t.notes}</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => onInputChange('notes', e.target.value)}
          placeholder={t.additionalNotes}
          className="text-base touch-manipulation min-h-[100px]"
          rows={4}
        />
        <p className="text-xs text-gray-500">Note: Ce champ n'est pas sauvegardé dans la base de données</p>
      </div>
    </>
  );
};

export default VanFormFields;
