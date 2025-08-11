
import { useState, useEffect, useRef, useCallback } from 'react';
import { Trip } from '../types';
import { fetchTripsFromDatabase } from '../TripDatabaseOperations';
import { transformDatabaseTrips } from '../tripTransformers';

export const useTripData = () => {
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
  }, [loadTrips]);

  const refreshTrips = useCallback(async () => {
    console.log('🚗 TripProvider: Force refreshing trips...');
    await loadTrips(false);
  }, [loadTrips]);

  return {
    trips,
    setTrips,
    error,
    setError,
    isLoading,
    loadTrips,
    refreshTrips,
  };
};
