import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Trip, TripContextType, UserWithRoles } from './trip/types';
import { fetchTripsFromDatabase, updateTripInDatabase, deleteTripFromDatabase } from './trip/TripDatabaseOperations';
import { insertTripWithMultipleCompanies } from './trip/TripDatabaseOperationsMultiCompany';
import { transformDatabaseTrips } from './trip/tripTransformers';
import { SelectedCompany } from '@/hooks/useTripFormMultiCompany';

interface TripContextMultiCompanyType {
  trips: Trip[];
  addTripWithMultipleCompanies: (tripData: Omit<Trip, 'id' | 'timestamp'> & { 
    userRoles: UserWithRoles[]; 
    startKm: number;
    companies: SelectedCompany[];
  }) => Promise<void>;
  addTrip: (tripData: Omit<Trip, 'id' | 'timestamp'> & { 
    userRoles: UserWithRoles[]; 
    startKm: number 
  }) => Promise<void>;
  deleteTrip: (tripId: number) => Promise<void>;
  endTrip: (tripId: number, endKm: number) => Promise<void>;
  refreshTrips: () => Promise<void>;
  error: string | null;
  isLoading: boolean;
  loading: boolean;
  refetch: () => Promise<void>;
}

const TripMultiCompanyContext = createContext<TripContextMultiCompanyType | undefined>(undefined);

export const TripMultiCompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isMountedRef = useRef(true);

  const loadTrips = useCallback(async (useCache = true) => {
    try {
      console.log('🚗 TripMultiCompanyProvider: Loading trips...');
      setIsLoading(true);
      const data = await fetchTripsFromDatabase(useCache);
      const transformedTrips = transformDatabaseTrips(data);
      
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
    console.log('🚗 TripMultiCompanyProvider: useEffect triggered - component mounted');
    isMountedRef.current = true;
    loadTrips();
    
    return () => {
      console.log('🚗 TripMultiCompanyProvider: Cleanup - component unmounting');
      isMountedRef.current = false;
    };
  }, []);

  const addTripWithMultipleCompanies = useCallback(async (tripData: Omit<Trip, 'id' | 'timestamp'> & { 
    userRoles: UserWithRoles[]; 
    startKm: number;
    companies: SelectedCompany[];
  }) => {
    try {
      console.log('TripMultiCompanyProvider: Adding trip with multiple companies:', tripData);
      
      if (!tripData.userRoles || tripData.userRoles.length === 0) {
        throw new Error('At least one user with roles must be selected');
      }

      if (!tripData.startKm || tripData.startKm < 0) {
        throw new Error('Starting kilometers must be provided and valid');
      }

      if (!tripData.companies || tripData.companies.length === 0) {
        throw new Error('At least one company must be selected');
      }

      const tripToInsert = {
        van: tripData.van,
        driver: tripData.driver,
        companies: tripData.companies,
        notes: tripData.notes,
        userIds: tripData.userIds,
        userRoles: tripData.userRoles,
        startKm: tripData.startKm,
        startDate: tripData.startDate,
        endDate: tripData.endDate
      };

      const newTrip = await insertTripWithMultipleCompanies(tripToInsert);
      console.log('TripMultiCompanyProvider: Trip inserted successfully:', newTrip);
      
      // Force refresh without cache
      await loadTrips(false);
      setError(null);
    } catch (error) {
      console.error('TripMultiCompanyProvider: Error adding trip:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add trip';
      setError(errorMessage);
      throw error;
    }
  }, [loadTrips]);

  // Keep original addTrip for backward compatibility
  const addTrip = useCallback(async (tripData: Omit<Trip, 'id' | 'timestamp'> & { userRoles: UserWithRoles[]; startKm: number }) => {
    // Convert single company format to multiple companies format
    const companies = tripData.company && tripData.branch ? [{
      companyId: tripData.company,
      branchId: tripData.branch
    }] : [];
    
    return addTripWithMultipleCompanies({ ...tripData, companies });
  }, [addTripWithMultipleCompanies]);

  const deleteTrip = useCallback(async (tripId: number) => {
    try {
      await deleteTripFromDatabase(tripId);
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
      await loadTrips(false);
      setError(null);
    } catch (error) {
      console.error('Error ending trip:', error);
      setError('Failed to end trip');
      throw error;
    }
  }, [loadTrips]);

  const refreshTrips = useCallback(async () => {
    console.log('🚗 TripMultiCompanyProvider: Force refreshing trips...');
    await loadTrips(false);
  }, [loadTrips]);

  const value: TripContextMultiCompanyType = {
    trips,
    addTrip,
    addTripWithMultipleCompanies,
    deleteTrip,
    endTrip,
    refreshTrips,
    error,
    isLoading,
    loading: isLoading,
    refetch: refreshTrips,
  };

  return <TripMultiCompanyContext.Provider value={value}>{children}</TripMultiCompanyContext.Provider>;
};

export const useTripMultiCompany = () => {
  const context = useContext(TripMultiCompanyContext);
  if (context === undefined) {
    throw new Error('useTripMultiCompany must be used within a TripMultiCompanyProvider');
  }
  return context;
};
