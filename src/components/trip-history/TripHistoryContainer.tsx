
import React, { useState, useMemo, useCallback } from 'react';
import { useTrip } from '@/contexts/TripContext';
import { useVans } from '@/hooks/useVans';
import { useCompanies } from '@/hooks/useCompanies';
import TripHistoryOptimizedSkeleton from './TripHistoryOptimizedSkeleton';
import TripHistoryFilters from './TripHistoryFilters';
import TripHistoryList from './TripHistoryList';
import TripDetailsDialog from '../TripDetailsDialog';

const TripHistoryContainer = React.memo(() => {
  console.log('🗂️ TripHistoryContainer: Component rendering...');

  // State management with useCallback to prevent recreating functions
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [vanFilter, setVanFilter] = useState('all');
  const [deletingTripId, setDeletingTripId] = useState(null);

  // Data fetching with safe defaults
  const { trips, isLoading, error, deleteTrip } = useTrip();
  const { vans } = useVans();
  const { companies } = useCompanies();

  // Memoize the trips processing to prevent recalculation
  const processedTrips = useMemo(() => {
    try {
      if (!Array.isArray(trips)) {
        console.warn('🗂️ TripHistoryContainer: trips is not an array:', trips);
        return [];
      }

      console.log('🗂️ TripHistoryContainer: Processing', trips.length, 'trips');

      return trips.map(trip => {
        if (!trip) return null;

        const processDate = (dateObj) => {
          if (!dateObj) return null;
          
          try {
            if (dateObj._type === 'Date' && dateObj.value) {
              if (dateObj.value.iso) {
                return dateObj.value.iso;
              }
              if (dateObj.value.value && typeof dateObj.value.value === 'number') {
                return new Date(dateObj.value.value).toISOString();
              }
            }
            
            if (typeof dateObj === 'string') {
              return dateObj;
            }
            
            if (dateObj instanceof Date) {
              return dateObj.toISOString();
            }
            
            if (typeof dateObj === 'number') {
              return new Date(dateObj).toISOString();
            }
            
            return null;
          } catch (err) {
            console.warn('🗂️ TripHistoryContainer: Error processing date:', err);
            return null;
          }
        };

        return {
          ...trip,
          startDate: processDate(trip.startDate),
          endDate: processDate(trip.endDate)
        };
      }).filter(Boolean);
    } catch (error) {
      console.error('🗂️ TripHistoryContainer: Error processing trips:', error);
      return [];
    }
  }, [trips]);

  // Memoize filtered trips to prevent recalculation
  const filteredTrips = useMemo(() => {
    try {
      if (!Array.isArray(processedTrips)) {
        return [];
      }

      return processedTrips.filter((trip) => {
        if (!trip) return false;

        const searchTermLower = (searchTerm || '').toLowerCase();
        const matchesSearchTerm =
          (trip.company || '').toLowerCase().includes(searchTermLower) ||
          (trip.branch || '').toLowerCase().includes(searchTermLower) ||
          (trip.driver || '').toLowerCase().includes(searchTermLower) ||
          (trip.notes || '').toLowerCase().includes(searchTermLower);

        const matchesCompany = companyFilter === 'all' || trip.company === companyFilter;
        const matchesVan = vanFilter === 'all' || trip.van === vanFilter;

        return matchesSearchTerm && matchesCompany && matchesVan;
      });
    } catch (error) {
      console.error('🗂️ TripHistoryContainer: Error filtering trips:', error);
      return [];
    }
  }, [processedTrips, searchTerm, companyFilter, vanFilter]);

  // Memoize event handlers to prevent recreating functions
  const handleOpenTripDetails = useCallback((trip) => {
    try {
      setSelectedTrip(trip);
    } catch (error) {
      console.error('🗂️ TripHistoryContainer: Error opening trip details:', error);
    }
  }, []);

  const handleDeleteTrip = useCallback(async (tripId) => {
    try {
      if (!tripId) {
        console.warn('🗂️ TripHistoryContainer: No trip ID provided for deletion');
        return;
      }
      
      setDeletingTripId(tripId);
      await deleteTrip(tripId);
    } catch (error) {
      console.error('🗂️ TripHistoryContainer: Error deleting trip:', error);
    } finally {
      setDeletingTripId(null);
    }
  }, [deleteTrip]);

  const handleClearFilters = useCallback(() => {
    try {
      setSearchTerm('');
      setCompanyFilter('all');
      setVanFilter('all');
    } catch (error) {
      console.error('🗂️ TripHistoryContainer: Error clearing filters:', error);
    }
  }, []);

  const handleCloseDialog = useCallback(() => {
    try {
      setSelectedTrip(null);
    } catch (error) {
      console.error('🗂️ TripHistoryContainer: Error closing dialog:', error);
    }
  }, []);

  if (isLoading) {
    return <TripHistoryOptimizedSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-4">Impossible de charger l'historique des voyages</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Filters */}
      <TripHistoryFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        companyFilter={companyFilter}
        setCompanyFilter={setCompanyFilter}
        vanFilter={vanFilter}
        setVanFilter={setVanFilter}
        companies={companies || []}
        vans={vans || []}
        onClearFilters={handleClearFilters}
      />

      {/* Trip List */}
      <TripHistoryList
        filteredTrips={filteredTrips}
        totalTrips={processedTrips}
        onTripClick={handleOpenTripDetails}
        onDeleteTrip={handleDeleteTrip}
        deletingTripId={deletingTripId}
      />

      {/* Trip Details Dialog */}
      <TripDetailsDialog
        trip={selectedTrip}
        isOpen={!!selectedTrip}
        onClose={handleCloseDialog}
      />
    </>
  );
});

TripHistoryContainer.displayName = 'TripHistoryContainer';

export default TripHistoryContainer;
