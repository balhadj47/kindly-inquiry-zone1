
import { useState, useCallback, useMemo } from 'react';
import { fetchTripsFromDatabase, fetchTripsCount } from '@/contexts/trip/TripDatabaseOperations';
import { transformDatabaseTrips } from '@/contexts/trip/tripTransformers';
import { Trip } from '@/contexts/TripContext';

const TRIPS_PER_PAGE = 20;

export const useTripPagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.ceil(totalCount / TRIPS_PER_PAGE);

  const fetchTripsPage = useCallback(async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const offset = (page - 1) * TRIPS_PER_PAGE;
      const [tripsData, count] = await Promise.all([
        fetchTripsFromDatabase(false, TRIPS_PER_PAGE, offset),
        fetchTripsCount()
      ]);
      
      const transformedTrips = transformDatabaseTrips(tripsData);
      setTrips(transformedTrips);
      setTotalCount(count);
      setCurrentPage(page);
    } catch (err) {
      console.error('Error fetching trips page:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch trips');
    } finally {
      setLoading(false);
    }
  }, []);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      fetchTripsPage(page);
    }
  }, [currentPage, totalPages, fetchTripsPage]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const refreshCurrentPage = useCallback(() => {
    fetchTripsPage(currentPage);
  }, [currentPage, fetchTripsPage]);

  const paginationInfo = useMemo(() => ({
    currentPage,
    totalPages,
    totalCount,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    startIndex: (currentPage - 1) * TRIPS_PER_PAGE + 1,
    endIndex: Math.min(currentPage * TRIPS_PER_PAGE, totalCount)
  }), [currentPage, totalPages, totalCount]);

  return {
    trips,
    loading,
    error,
    paginationInfo,
    goToPage,
    nextPage,
    prevPage,
    refreshCurrentPage,
    fetchTripsPage
  };
};
