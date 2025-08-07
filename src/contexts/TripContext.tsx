import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Trip, TripContextType, UserWithRoles } from './trip/types';
import { insertTripToDatabase, fetchTripsFromDatabase, updateTripInDatabase, deleteTripFromDatabase } from './trip/TripDatabaseOperations';
import { transformDatabaseTrips } from './trip/tripTransformers';
import { CompanyBranchSelection } from '@/types/company-selection';

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isMountedRef = useRef(true);

  const loadTrips = useCallback(async (useCache = true) => {
    try {
      console.log('🚗 TripProvider: Loading trips...');
      setIsLoading(true);
      const data = await fetchTripsFromDatabase(useCache);
      const transformedTrips = transformDatabaseTrips(data);
      console.log('Transformed trips with dates:', transformedTrips);
      
      if (isMountedRef.current) {
        setTrips(transformedTrips);
        setError(null);
      }
    } catch (error) {
      console.error('Error loading trips:', error);
      if (isMountedRef.current) {
        setError('Failed to load trips');
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    console.log('🚗 TripProvider: useEffect triggered - component mounted');
    isMountedRef.current = true;
    loadTrips();
    
    return () => {
      console.log('🚗 TripProvider: Cleanup - component unmounting');
      isMountedRef.current = false;
    };
  }, []); // Remove loadTrips from dependencies to prevent infinite loop

  const addTrip = useCallback(async (tripData: Omit<Trip, 'id' | 'timestamp'> & { 
    userRoles: UserWithRoles[]; 
    startKm: number; 
    selectedCompanies?: CompanyBranchSelection[];
  }) => {
    try {
      console.log('TripProvider: Adding trip with data:', tripData);
      console.log('Planned dates being sent:', {
        startDate: tripData.startDate,
        endDate: tripData.endDate
      });
      console.log('Selected companies being sent from TripContext:', tripData.selectedCompanies);
      
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
        startKm: tripData.startKm,
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        selectedCompanies: tripData.selectedCompanies // Pass selectedCompanies to database operation
      };

      const newTrip = await insertTripToDatabase(tripToInsert);
      console.log('TripProvider: Trip inserted successfully:', newTrip);
      
      // Force refresh without cache
      await loadTrips(false);
      setError(null);
    } catch (error) {
      console.error('TripProvider: Error adding trip:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add trip';
      setError(errorMessage);
      throw error;
    }
  }, [loadTrips]);

  const deleteTrip = useCallback(async (tripId: number) => {
    try {
      await deleteTripFromDatabase(tripId);
      // Force refresh without cache
      await loadTrips(false);
      setError(null);
    } catch (error) {
      console.error('Error deleting trip:', error);
      setError('Failed to delete trip');
      throw error;
    }
  }, [loadTrips]);

  const endTrip = useCallback(async (tripId: number, endKm: number) => {
    try {
      await updateTripInDatabase(tripId, endKm);
      // Force refresh without cache
      await loadTrips(false);
      setError(null);
    } catch (error) {
      console.error('Error ending trip:', error);
      setError('Failed to end trip');
      throw error;
    }
  }, [loadTrips]);

  const refreshTrips = useCallback(async () => {
    console.log('🚗 TripProvider: Force refreshing trips...');
    await loadTrips(false);
  }, [loadTrips]);

  const value: TripContextType = {
    trips,
    addTrip,
    deleteTrip,
    endTrip,
    refreshTrips,
    error,
    isLoading,
    // Add aliases for compatibility
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

// Export the hook with the expected name for backward compatibility
export const useTripContext = useTrip;

// Re-export types for easy access
export type { Trip, TripContextType, UserWithRoles } from './trip/types';
