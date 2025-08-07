
import React from 'react';
import { TripFormData } from '@/hooks/useTripForm';
import { useTripFormData } from '@/hooks/trip-form/useTripFormData';
import VanSelectionStep from './VanSelectionStep';

interface VehicleSelectionStepProps extends TripFormData {
  handleInputChange: (field: string, value: string) => void;
}

const VehicleSelectionStep: React.FC<VehicleSelectionStepProps> = (props) => {
  const { availableVans, vans, lastKm, loadingLastKm } = useTripFormData(props, props.handleInputChange);

  return (
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
  );
};

export default VehicleSelectionStep;
