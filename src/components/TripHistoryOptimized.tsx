
import React, { useState, useMemo } from 'react';
import { useTrip } from '@/contexts/TripContext';
import { useVans } from '@/hooks/useVans';
import { useCompanies } from '@/hooks/useCompanies';
import TripHistoryOptimizedSkeleton from './trip-history/TripHistoryOptimizedSkeleton';
import TripHistoryHeader from './trip-history/TripHistoryHeader';
import TripHistoryStats from './trip-history/TripHistoryStats';
import TripHistoryFilters from './trip-history/TripHistoryFilters';
import TripHistoryList from './trip-history/TripHistoryList';
import TripDetailsDialog from './TripDetailsDialog';

const TripHistoryOptimized = () => {
  console.log('🗂️ TripHistoryOptimized: Component rendering...');

  // State management
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [vanFilter, setVanFilter] = useState('all');
  const [deletingTripId, setDeletingTripId] = useState(null);

  // Data fetching
  const { trips, isLoading, error, deleteTrip } = useTrip();
  const { vans } = useVans();
  const { companies } = useCompanies();

  console.log('🗂️ TripHistoryOptimized: Raw trips data:', trips);

  // Process trips data
  const processedTrips = useMemo(() => {
    if (!Array.isArray(trips)) {
      console.warn('🗂️ TripHistoryOptimized: trips is not an array:', trips);
      return [];
    }

    return trips.map(trip => {
      try {
        if (!trip) {
          console.warn('🗂️ TripHistoryOptimized: Found null trip');
          return null;
        }

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
            console.warn('🗂️ TripHistoryOptimized: Error processing date:', err, dateObj);
            return null;
          }
        };

        return {
          ...trip,
          startDate: processDate(trip.startDate),
          endDate: processDate(trip.endDate)
        };
      } catch (dateError) {
        console.error('🗂️ TripHistoryOptimized: Error processing trip:', dateError, trip);
        return {
          ...trip,
          startDate: null,
          endDate: null
        };
      }
    }).filter(Boolean);
  }, [trips]);

  // Filter trips
  const filteredTrips = useMemo(() => {
    if (!Array.isArray(processedTrips)) {
      return [];
    }

    return processedTrips.filter((trip) => {
      if (!trip) return false;

      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearchTerm =
        (trip.company || '').toLowerCase().includes(searchTermLower) ||
        (trip.branch || '').toLowerCase().includes(searchTermLower) ||
        (trip.driver || '').toLowerCase().includes(searchTermLower) ||
        (trip.notes || '').toLowerCase().includes(searchTermLower);

      const matchesCompany = companyFilter === 'all' || trip.company === companyFilter;
      const matchesVan = vanFilter === 'all' || trip.van === vanFilter;

      return matchesSearchTerm && matchesCompany && matchesVan;
    });
  }, [processedTrips, searchTerm, companyFilter, vanFilter]);

  // Event handlers
  const handleOpenTripDetails = (trip) => {
    setSelectedTrip(trip);
  };

  const handleDeleteTrip = async (tripId) => {
    try {
      setDeletingTripId(tripId);
      await deleteTrip(tripId);
    } catch (error) {
      console.error('Error deleting trip:', error);
    } finally {
      setDeletingTripId(null);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCompanyFilter('all');
    setVanFilter('all');
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white rounded-2xl p-8 shadow-xl">
          <TripHistoryHeader />
        </div>

        {/* Statistics */}
        <TripHistoryStats trips={processedTrips} />

        {/* Filters */}
        <TripHistoryFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          companyFilter={companyFilter}
          setCompanyFilter={setCompanyFilter}
          vanFilter={vanFilter}
          setVanFilter={setVanFilter}
          companies={companies}
          vans={vans}
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
          onClose={() => setSelectedTrip(null)}
        />
      </div>
    </div>
  );
};

export default TripHistoryOptimized;
