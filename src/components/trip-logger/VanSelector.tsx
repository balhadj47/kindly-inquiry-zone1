
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';

interface Van {
  id: string;
  license_plate: string;
  model: string;
}

interface VanSelectorProps {
  availableVans: Van[];
  totalVans: Van[];
  selectedVanId: string;
  onVanChange: (vanId: string) => void;
}

const VanSelector: React.FC<VanSelectorProps> = ({
  availableVans,
  totalVans,
  selectedVanId,
  onVanChange
}) => {
  const { t } = useLanguage();

  return (
    <div>
      <Label htmlFor="van">{t.selectVan}</Label>
      <Select value={selectedVanId} onValueChange={onVanChange}>
        <SelectTrigger>
          <SelectValue placeholder={t.selectVan} />
        </SelectTrigger>
        <SelectContent>
          {availableVans.map((van) => (
            <SelectItem key={van.id} value={van.id}>
              {van.license_plate} - {van.model}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {availableVans.length < totalVans.length && (
        <p className="text-sm text-muted-foreground mt-1">
          {totalVans.length - availableVans.length} van(s) currently in mission
        </p>
      )}
    </div>
  );
};

export default VanSelector;
