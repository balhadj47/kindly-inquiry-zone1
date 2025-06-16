
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Trip, TripContextType, UserWithRoles } from './trip/types';
import { insertTripToDatabase, fetchTripsFromDatabase, updateTripInDatabase, deleteTripFromDatabase } from './trip/TripDatabaseOperations';
import { transformDatabaseTrips } from './trip/tripTransformers';

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadTrips = async () => {
    try {
      const data = await fetchTripsFromDatabase();
      const transformedTrips = transformDatabaseTrips(data);
      setTrips(transformedTrips);
      setError(null);
    } catch (error) {
      console.error('Error loading trips:', error);
      setError('Failed to load trips');
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const addTrip = async (tripData: Omit<Trip, 'id' | 'timestamp'> & { userRoles: UserWithRoles[]; startKm: number }) => {
    try {
      console.log('TripProvider: Adding trip with data:', tripData);
      
      if (!tripData.userRoles || tripData.userRoles.length === 0) {
        throw new Error('At least one user with roles must be selected');
      }

      if (!tripData.startKm || tripData.startKm < 0) {
        throw new Error('Starting kilometers must be provided and valid');
      }

      const tripToInsert = {
        van: tripData.van,
        driver: tripData.driver,
        company: tripData.company,
        branch: tripData.branch,
        notes: tripData.notes,
        userIds: tripData.userIds,
        userRoles: tripData.userRoles,
        startKm: tripData.startKm
      };

      const newTrip = await insertTripToDatabase(tripToInsert);
      console.log('TripProvider: Trip inserted successfully:', newTrip);
      
      await loadTrips();
      setError(null);
    } catch (error) {
      console.error('TripProvider: Error adding trip:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add trip';
      setError(errorMessage);
      throw error;
    }
  };

  const deleteTrip = async (tripId: number) => {
    try {
      await deleteTripFromDatabase(tripId);
      await loadTrips();
      setError(null);
    } catch (error) {
      console.error('Error deleting trip:', error);
      setError('Failed to delete trip');
      throw error;
    }
  };

  const endTrip = async (tripId: number, endKm: number) => {
    try {
      await updateTripInDatabase(tripId, endKm);
      await loadTrips();
      setError(null);
    } catch (error) {
      console.error('Error ending trip:', error);
      setError('Failed to end trip');
      throw error;
    }
  };

  const refreshTrips = async () => {
    await loadTrips();
  };

  const value: TripContextType = {
    trips,
    addTrip,
    deleteTrip,
    endTrip,
    refreshTrips,
    error,
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

// Export the hook with the expected name for backward compatibility
export const useTripContext = useTrip;

// Re-export types for easy access
export type { Trip, TripContextType, UserWithRoles } from './trip/types';
