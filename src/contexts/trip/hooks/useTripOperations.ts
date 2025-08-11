
import { useCallback, useRef } from 'react';
import { Trip, UserWithRoles } from '../types';
import { insertTripToDatabase, updateTripInDatabase, deleteTripFromDatabase } from '../TripDatabaseOperations';
import { CompanyBranchSelection } from '@/types/company-selection';
import { useQueryClient } from '@tanstack/react-query';

export const useTripOperations = (
  trips: Trip[],
  setTrips: React.Dispatch<React.SetStateAction<Trip[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  loadTrips: (useCache?: boolean) => Promise<void>
) => {
  const isMountedRef = useRef(true);
  const queryClient = useQueryClient();

  const addTrip = useCallback(async (tripData: Omit<Trip, 'id' | 'timestamp'> & { 
    userRoles: UserWithRoles[]; 
    startKm: number; 
    selectedCompanies?: CompanyBranchSelection[];
  }) => {
    try {
      console.log('TripProvider: Adding trip with data:', tripData);
      
      if (!tripData.userRoles || tripData.userRoles.length === 0) {
        throw new Error('At least one user with roles must be selected');
      }

      if (!tripData.startKm || tripData.startKm < 0) {
        throw new Error('Starting kilometers must be provided and valid');
      }

      // Create optimistic trip
      const optimisticTrip: Trip = {
        id: Date.now(),
        van: tripData.van,
        driver: tripData.driver,
        company: tripData.company,
        branch: tripData.branch,
        timestamp: new Date().toISOString(),
        notes: tripData.notes,
        userIds: tripData.userIds,
        userRoles: tripData.userRoles,
        start_km: tripData.startKm,
        status: 'active',
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        companies_data: tripData.selectedCompanies,
        created_at: new Date().toISOString(),
      };

      // Add optimistically to local state
      setTrips(prevTrips => [optimisticTrip, ...prevTrips]);

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
        selectedCompanies: tripData.selectedCompanies
      };

      const newTrip = await insertTripToDatabase(tripToInsert);
      console.log('TripProvider: Trip inserted successfully:', newTrip);
      
      // Replace optimistic data with real data
      const realTrip = {
        ...optimisticTrip,
        id: newTrip.id,
        timestamp: newTrip.created_at
      };
      
      setTrips(prevTrips => 
        prevTrips.map(trip => 
          trip.id === optimisticTrip.id ? realTrip : trip
        )
      );
      
      // Update React Query cache
      queryClient.invalidateQueries({ queryKey: ['vans'] });
      setError(null);
    } catch (error) {
      console.error('TripProvider: Error adding trip:', error);
      // Remove optimistic trip on error
      setTrips(prevTrips => 
        prevTrips.filter(trip => trip.id !== Date.now())
      );
      const errorMessage = error instanceof Error ? error.message : 'Failed to add trip';
      setError(errorMessage);
      throw error;
    }
  }, [queryClient, setTrips, setError]);

  const deleteTrip = useCallback(async (tripId: number) => {
    try {
      // Remove optimistically
      const tripToDelete = trips.find(trip => trip.id === tripId);
      setTrips(prevTrips => prevTrips.filter(trip => trip.id !== tripId));
      
      await deleteTripFromDatabase(tripId);
      
      // Update React Query cache
      queryClient.invalidateQueries({ queryKey: ['vans'] });
      setError(null);
    } catch (error) {
      console.error('Error deleting trip:', error);
      // Restore trip on error
      await loadTrips(false);
      setError('Failed to delete trip');
      throw error;
    }
  }, [trips, queryClient, loadTrips, setTrips, setError]);

  const endTrip = useCallback(async (tripId: number, endKm: number) => {
    try {
      // Update optimistically
      setTrips(prevTrips =>
        prevTrips.map(trip =>
          trip.id === tripId
            ? { ...trip, end_km: endKm, status: 'completed' }
            : trip
        )
      );
      
      await updateTripInDatabase(tripId, endKm);
      
      // Update React Query cache
      queryClient.invalidateQueries({ queryKey: ['vans'] });
      setError(null);
    } catch (error) {
      console.error('Error ending trip:', error);
      // Restore original state on error
      await loadTrips(false);
      setError('Failed to end trip');
      throw error;
    }
  }, [queryClient, loadTrips, setTrips, setError]);

  return {
    addTrip,
    deleteTrip,
    endTrip,
  };
};
