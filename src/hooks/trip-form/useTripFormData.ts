
import { useMemo, useCallback } from 'react';
import { useTrip } from '@/contexts/TripContext';
import { useCompanies } from '@/hooks/useCompanies';
import { useVans } from '@/hooks/useVans';
import { useVanKilometerLogic } from '@/hooks/useVanKilometerLogic';

export const useTripFormData = (formData: any, handleInputChange: (field: string, value: string) => void) => {
  const { trips } = useTrip();
  const { data: companies } = useCompanies();
  const { vans } = useVans();

  // Memoize the startKm change handler to prevent unnecessary re-renders
  const handleStartKmChange = useCallback((value: string) => {
    console.log('🔄 TripFormData: handleStartKmChange called with:', value);
    handleInputChange('startKm', value);
  }, [handleInputChange]);

  const { lastKm, loadingLastKm } = useVanKilometerLogic({
    vanId: formData.vanId,
    startKm: formData.startKm,
    onStartKmChange: handleStartKmChange
  });

  // Memoize available vans calculation to prevent unnecessary recalculations
  const availableVans = useMemo(() => {
    console.log('🔄 TripFormData: Calculating available vans');
    if (!trips || !Array.isArray(trips) || !vans || !Array.isArray(vans)) {
      console.log('🔄 TripFormData: Missing data for available vans calculation');
      return [];
    }
    
    const activeVanIds = trips
      .filter(trip => trip?.status === 'active')
      .map(trip => trip.van)
      .filter(Boolean);
    
    const result = vans.filter(van => van?.id && !activeVanIds.includes(van.id));
    console.log('🔄 TripFormData: Available vans:', result.length);
    return result;
  }, [trips, vans]);

  return {
    companies: companies || [],
    availableVans,
    vans: vans || [],
    lastKm,
    loadingLastKm,
  };
};
