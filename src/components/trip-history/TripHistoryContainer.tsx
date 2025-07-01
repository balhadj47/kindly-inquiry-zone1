
import React, { useState, useMemo, useCallback } from 'react';
import { useTrip } from '@/contexts/TripContext';
import { useVans } from '@/hooks/useVans';
import { useCompanies } from '@/hooks/useCompanies';
import TripHistoryOptimizedSkeleton from './TripHistoryOptimizedSkeleton';
import TripHistoryFilters from './TripHistoryFilters';
import TripHistoryList from './TripHistoryList';
import TripDetailsDialog from '../TripDetailsDialog';

const TripHistoryContainer = React.memo(() => {
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [vanFilter, setVanFilter] = useState('all');
  const [deletingTripId, setDeletingTripId] = useState(null);

  const { trips, isLoading, error, deleteTrip } = useTrip();
  const { vans } = useVans();
  const { data: companies } = useCompanies();

  const processedTrips = useMemo(() => {
    try {
      if (!Array.isArray(trips)) {
        return [];
      }

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
      return [];
    }
  }, [trips]);

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
      return [];
    }
  }, [processedTrips, searchTerm, companyFilter, vanFilter]);

  const handleOpenTripDetails = useCallback((trip) => {
    try {
      setSelectedTrip(trip);
    } catch (error) {
      // Silent error handling
    }
  }, []);

  const handleDeleteTrip = useCallback(async (tripId) => {
    try {
      if (!tripId) {
        return;
      }
      
      setDeletingTripId(tripId);
      await deleteTrip(tripId);
    } catch (error) {
      // Silent error handling
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
      // Silent error handling
    }
  }, []);

  const handleCloseDialog = useCallback(() => {
    try {
      setSelectedTrip(null);
    } catch (error) {
      // Silent error handling
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

      <TripHistoryList
        filteredTrips={filteredTrips}
        totalTrips={processedTrips}
        onTripClick={handleOpenTripDetails}
        onDeleteTrip={handleDeleteTrip}
        deletingTripId={deletingTripId}
      />

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
