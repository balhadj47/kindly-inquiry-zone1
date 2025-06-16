
import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { Trip, TripContextType, UserWithRoles } from './trip/types';
import { 
  fetchTripsFromDatabase, 
  insertTripToDatabase, 
  updateTripInDatabase, 
  deleteTripFromDatabase 
} from './trip/TripDatabaseOperations';
import { transformDatabaseTrips, transformDatabaseTrip } from './trip/tripTransformers';

// Re-export types for backward compatibility
export type { UserWithRoles, Trip };

const TripContext = createContext<TripContextType | undefined>(undefined);

export const useTripContext = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTripContext must be used within a TripProvider');
  }
  return context;
};

interface TripProviderProps {
  children: ReactNode;
}

export const TripProvider: React.FC<TripProviderProps> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const fetchTrips = async () => {
    try {
      const data = await fetchTripsFromDatabase();
      const transformedTrips = transformDatabaseTrips(data);

      if (isMountedRef.current) {
        setTrips(transformedTrips);
      }
    } catch (err) {
      console.error('Error fetching trips:', err);
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    fetchTrips();
    
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const addTrip = async (tripData: Omit<Trip, 'id' | 'timestamp'> & { userRoles?: UserWithRoles[]; startKm?: number }) => {
    try {
      const data = await insertTripToDatabase(tripData);

      if (data && isMountedRef.current) {
        const newTrip = transformDatabaseTrip(data);
        setTrips(prevTrips => [newTrip, ...prevTrips]);
      }
    } catch (err) {
      console.error('Error adding trip:', err);
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to add trip');
      }
      throw err;
    }
  };

  const endTrip = async (tripId: number, endKm: number) => {
    try {
      await updateTripInDatabase(tripId, endKm);

      if (isMountedRef.current) {
        setTrips(prevTrips => 
          prevTrips.map(trip => 
            trip.id === tripId 
              ? { ...trip, endKm, status: 'completed' }
              : trip
          )
        );
      }
    } catch (err) {
      console.error('Error ending trip:', err);
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to end trip');
      }
      throw err;
    }
  };

  const deleteTrip = async (tripId: number) => {
    try {
      await deleteTripFromDatabase(tripId);

      if (isMountedRef.current) {
        setTrips(prevTrips => prevTrips.filter(trip => trip.id !== tripId));
      }
    } catch (err) {
      console.error('Error deleting trip:', err);
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to delete trip');
      }
      throw err;
    }
  };

  const refreshTrips = async () => {
    await fetchTrips();
  };

  return (
    <TripContext.Provider value={{ trips, addTrip, deleteTrip, endTrip, refreshTrips, error }}>
      {children}
    </TripContext.Provider>
  );
};
