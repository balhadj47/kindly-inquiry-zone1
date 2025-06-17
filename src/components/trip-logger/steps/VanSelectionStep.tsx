
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import VanSelector from '../VanSelector';

interface Van {
  id: string;
  license_plate: string;
  model: string;
  reference_code?: string;
}

interface VanSelectionStepProps {
  availableVans: Van[];
  totalVans: Van[];
  selectedVanId: string;
  onVanChange: (vanId: string) => void;
  startKm: string;
  onStartKmChange: (value: string) => void;
  lastKm: number | null;
  loadingLastKm: boolean;
}

const VanSelectionStep: React.FC<VanSelectionStepProps> = ({
  availableVans,
  totalVans,
  selectedVanId,
  onVanChange,
  startKm,
  onStartKmChange,
  lastKm,
  loadingLastKm
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Sélection du véhicule</h3>
        <VanSelector
          availableVans={availableVans}
          totalVans={totalVans}
          selectedVanId={selectedVanId}
          onVanChange={onVanChange}
        />
      </div>

      <div>
        <Label htmlFor="startKm">
          Kilométrage de départ *
          {loadingLastKm && (
            <span className="text-sm text-muted-foreground ml-2">(Chargement des données du dernier voyage...)</span>
          )}
        </Label>
        <Input
          id="startKm"
          type="number"
          placeholder={
            selectedVanId 
              ? (lastKm !== null ? `Auto-rempli depuis le dernier voyage: ${lastKm} km` : "Entrez le kilométrage de départ")
              : "Sélectionnez d'abord un véhicule"
          }
          value={startKm}
          onChange={(e) => onStartKmChange(e.target.value)}
          min="0"
          required
          disabled={loadingLastKm}
        />
        {lastKm !== null && selectedVanId && (
          <p className="text-sm text-muted-foreground mt-1">
            Dernier voyage terminé à: {lastKm} km
          </p>
        )}
      </div>
    </div>
  );
};

export default VanSelectionStep;
