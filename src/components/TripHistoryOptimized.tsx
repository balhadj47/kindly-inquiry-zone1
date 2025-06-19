
import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTrip } from '@/contexts/TripContext';
import TripHistoryHeader from './trip-history/TripHistoryHeader';
import TripHistoryFilters from './trip-history/TripHistoryFilters';
import TripHistoryStats from './trip-history/TripHistoryStats';
import TripHistoryList from './trip-history/TripHistoryList';
import TripHistoryOptimizedSkeleton from './trip-history/TripHistoryOptimizedSkeleton';
import TripDetailsDialog from './TripDetailsDialog';
import TripEndDialog from './trip-history/TripEndDialog';
import TripDeleteDialog from './trip-history/TripDeleteDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useVans } from '@/hooks/useVans';
import { useCompanies } from '@/hooks/useCompanies';

const TripHistoryOptimized = () => {
  console.log('🗂️ TripHistoryOptimized: Component rendering...');

  // State management
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [tripToEnd, setTripToEnd] = useState(null);
  const [tripToDelete, setTripToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [vanFilter, setVanFilter] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [deletingTripId, setDeletingTripId] = useState(null);

  // Data fetching from context
  const { trips, isLoading, error, deleteTrip } = useTrip();
  const { vans } = useVans();
  const { companies } = useCompanies();
  
  console.log('🗂️ TripHistoryOptimized: Raw trips data:', trips);
  console.log('🗂️ TripHistoryOptimized: Data state:', {
    tripsCount: trips?.length || 0,
    isLoading,
    error,
    hasTrips: Array.isArray(trips)
  });

  // Process trips data to handle complex date structures
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

        // Handle complex date structures more robustly
        const processDate = (dateObj) => {
          if (!dateObj) return null;
          
          try {
            // Handle nested date structure with _type: 'Date'
            if (dateObj._type === 'Date' && dateObj.value) {
              if (dateObj.value.iso) {
                return dateObj.value.iso;
              }
              if (dateObj.value.value && typeof dateObj.value.value === 'number') {
                return new Date(dateObj.value.value).toISOString();
              }
            }
            
            // Handle direct date values
            if (typeof dateObj === 'string') {
              return dateObj;
            }
            
            if (dateObj instanceof Date) {
              return dateObj.toISOString();
            }
            
            // Try to parse as timestamp if it's a number
            if (typeof dateObj === 'number') {
              return new Date(dateObj).toISOString();
            }
            
            return null;
          } catch (err) {
            console.warn('🗂️ TripHistoryOptimized: Error processing individual date:', err, dateObj);
            return null;
          }
        };

        const processedTrip = {
          ...trip,
          startDate: processDate(trip.startDate),
          endDate: processDate(trip.endDate)
        };

        console.log('🗂️ TripHistoryOptimized: Processed trip:', {
          id: trip.id,
          company: trip.company,
          driver: trip.driver,
          status: trip.status,
          originalStartDate: trip.startDate,
          processedStartDate: processedTrip.startDate,
          originalEndDate: trip.endDate,
          processedEndDate: processedTrip.endDate
        });

        return processedTrip;
      } catch (dateError) {
        console.error('🗂️ TripHistoryOptimized: Error processing trip dates:', dateError, trip);
        return {
          ...trip,
          startDate: null,
          endDate: null
        };
      }
    }).filter(Boolean);
  }, [trips]);

  // Handlers for dialogs
  const handleOpenTripDetails = (trip) => {
    console.log('🗂️ TripHistoryOptimized: Opening trip details for:', trip?.id);
    setSelectedTrip(trip);
  };
  const handleCloseTripDetails = () => {
    console.log('🗂️ TripHistoryOptimized: Closing trip details');
    setSelectedTrip(null);
  };
  const handleOpenTripEndDialog = (trip) => {
    console.log('🗂️ TripHistoryOptimized: Opening end dialog for:', trip?.id);
    setTripToEnd(trip);
  };
  const handleCloseTripEndDialog = () => {
    console.log('🗂️ TripHistoryOptimized: Closing end dialog');
    setTripToEnd(null);
  };
  const handleOpenTripDeleteDialog = (trip) => {
    console.log('🗂️ TripHistoryOptimized: Opening delete dialog for:', trip?.id);
    setTripToDelete(trip);
  };
  const handleCloseTripDeleteDialog = () => {
    console.log('🗂️ TripHistoryOptimized: Closing delete dialog');
    setTripToDelete(null);
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

  // Filtering trips based on search term, company, van, and active tab
  const filteredTrips = useMemo(() => {
    console.log('🗂️ TripHistoryOptimized: Filtering trips...');
    
    if (!Array.isArray(processedTrips)) {
      console.warn('🗂️ TripHistoryOptimized: processedTrips is not an array:', processedTrips);
      return [];
    }

    try {
      const filtered = processedTrips.filter((trip) => {
        if (!trip) {
          console.warn('🗂️ TripHistoryOptimized: Found null/undefined trip');
          return false;
        }

        const searchTermLower = searchTerm.toLowerCase();
        const matchesSearchTerm =
          (trip.company || '').toLowerCase().includes(searchTermLower) ||
          (trip.branch || '').toLowerCase().includes(searchTermLower) ||
          (trip.driver || '').toLowerCase().includes(searchTermLower) ||
          (trip.notes || '').toLowerCase().includes(searchTermLower);

        const matchesCompany = companyFilter === 'all' || trip.company === companyFilter;
        const matchesVan = vanFilter === 'all' || trip.van === vanFilter;

        const matchesTab =
          activeTab === 'all' ||
          (activeTab === 'active' && trip.status === 'active') ||
          (activeTab === 'completed' && trip.status === 'completed');

        return matchesSearchTerm && matchesCompany && matchesVan && matchesTab;
      });

      console.log('🗂️ TripHistoryOptimized: Filtered trips count:', filtered.length);
      return filtered;
    } catch (filterError) {
      console.error('🗂️ TripHistoryOptimized: Error filtering trips:', filterError);
      return [];
    }
  }, [processedTrips, searchTerm, companyFilter, vanFilter, activeTab]);

  // Sorting trips
  const sortedTrips = useMemo(() => {
    console.log('🗂️ TripHistoryOptimized: Sorting trips...');
    
    if (!Array.isArray(filteredTrips)) {
      console.warn('🗂️ TripHistoryOptimized: filteredTrips is not an array:', filteredTrips);
      return [];
    }

    try {
      const sorted = [...filteredTrips].sort((a, b) => {
        if (!a || !b) {
          console.warn('🗂️ TripHistoryOptimized: Found null trips in sorting');
          return 0;
        }

        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sortOrder === 'asc' ? -1 : 1;
        if (bValue == null) return sortOrder === 'asc' ? 1 : -1;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        } else if (aValue instanceof Date && bValue instanceof Date) {
          return sortOrder === 'asc'
            ? aValue.getTime() - bValue.getTime()
            : bValue.getTime() - aValue.getTime();
        } else {
          return sortOrder === 'asc' 
            ? String(aValue).localeCompare(String(bValue)) 
            : String(bValue).localeCompare(String(aValue));
        }
      });
      
      console.log('🗂️ TripHistoryOptimized: Sorted trips count:', sorted.length);
      return sorted;
    } catch (sortError) {
      console.error('🗂️ TripHistoryOptimized: Error sorting trips:', sortError);
      return filteredTrips;
    }
  }, [filteredTrips, sortBy, sortOrder]);

  const totalTrips = Array.isArray(processedTrips) ? processedTrips.length : 0;
  const activeTripsCount = Array.isArray(processedTrips) ? processedTrips.filter(trip => trip && trip.status === 'active').length : 0;
  const completedTripsCount = Array.isArray(processedTrips) ? processedTrips.filter(trip => trip && trip.status === 'completed').length : 0;

  console.log('🗂️ TripHistoryOptimized: Final render state:', {
    totalTrips,
    activeTripsCount,
    completedTripsCount,
    filteredCount: sortedTrips.length,
    currentTab: activeTab
  });

  if (isLoading) {
    console.log('🗂️ TripHistoryOptimized: Showing loading skeleton');
    return <TripHistoryOptimizedSkeleton />;
  }

  if (error) {
    console.error('🗂️ TripHistoryOptimized: Showing error state:', error);
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-4">Impossible de charger l'historique des voyages</p>
          <Button onClick={() => window.location.reload()}>
            Actualiser la page
          </Button>
        </div>
      </div>
    );
  }

  console.log('🗂️ TripHistoryOptimized: Rendering main content with', sortedTrips.length, 'trips');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <TripHistoryHeader />
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un voyage
        </Button>
      </div>

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
        disabled={isLoading}
      />

      <TripHistoryStats trips={sortedTrips} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            Tous ({totalTrips})
          </TabsTrigger>
          <TabsTrigger value="active">
            Actifs ({activeTripsCount})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Terminés ({completedTripsCount})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          <TripHistoryList
            filteredTrips={sortedTrips}
            totalTrips={processedTrips}
            onTripClick={handleOpenTripDetails}
            onDeleteTrip={handleDeleteTrip}
            deletingTripId={deletingTripId}
          />
        </TabsContent>
      </Tabs>

      <TripDetailsDialog
        trip={selectedTrip}
        isOpen={!!selectedTrip}
        onClose={handleCloseTripDetails}
      />

      <TripEndDialog
        trip={tripToEnd}
        isOpen={!!tripToEnd}
        onClose={handleCloseTripEndDialog}
      />

      <TripDeleteDialog
        trip={tripToDelete}
        isOpen={!!tripToDelete}
        onClose={handleCloseTripDeleteDialog}
        onConfirm={() => {
          console.log('🗂️ TripHistoryOptimized: Deleting trip:', tripToDelete);
          handleDeleteTrip(tripToDelete.id);
          handleCloseTripDeleteDialog();
        }}
      />
    </div>
  );
};

export default TripHistoryOptimized;
