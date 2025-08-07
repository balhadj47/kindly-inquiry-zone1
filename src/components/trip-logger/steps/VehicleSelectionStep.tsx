
import React from 'react';
import { Car } from 'lucide-react';
import { TripFormData } from '@/hooks/useTripForm';
import { useTripFormData } from '@/hooks/trip-form/useTripFormData';
import VanSelectionStep from './VanSelectionStep';

interface VehicleSelectionStepProps extends TripFormData {
  handleInputChange: (field: string, value: string) => void;
}

const VehicleSelectionStep: React.FC<VehicleSelectionStepProps> = (props) => {
  const { availableVans, vans, lastKm, loadingLastKm } = useTripFormData(props, props.handleInputChange);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
          <Car className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Sélection du véhicule</h3>
        <p className="text-gray-600">Choisissez le véhicule pour cette mission</p>
      </div>

      <VanSelectionStep
        availableVans={availableVans}
        totalVans={vans}
        selectedVanId={props.vanId}
        onVanChange={(vanId) => props.handleInputChange('vanId', vanId)}
        startKm={props.startKm}
        onStartKmChange={(value) => props.handleInputChange('startKm', value)}
        lastKm={lastKm}
        loadingLastKm={loadingLastKm}
      />
    </div>
  );
};

export default VehicleSelectionStep;
