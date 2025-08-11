
import React, { createContext, useContext } from 'react';
import { Trip, TripContextType } from './trip/types';
import { useTripData } from './trip/hooks/useTripData';
import { useTripOperations } from './trip/hooks/useTripOperations';

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    trips,
    setTrips,
    error,
    setError,
    isLoading,
    loadTrips,
    refreshTrips,
  } = useTripData();

  const {
    addTrip,
    deleteTrip,
    endTrip,
  } = useTripOperations(trips, setTrips, setError, loadTrips);

  const value: TripContextType = {
    trips,
    addTrip,
    deleteTrip,
    endTrip,
    refreshTrips,
    error,
    isLoading,
    loading: isLoading,
    refetch: refreshTrips,
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};

export const useTripContext = useTrip;

export type { Trip, TripContextType } from './trip/types';
