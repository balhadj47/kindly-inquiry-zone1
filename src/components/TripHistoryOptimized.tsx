
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTripsQuery } from '@/hooks/trips/useTripsQuery';
import { RefreshButton } from '@/components/ui/refresh-button';
import TripHistoryHeader from './trip-history/TripHistoryHeader';
import TripHistoryFilters from './trip-history/TripHistoryFilters';
import TripHistoryStats from './trip-history/TripHistoryStats';
import TripHistoryList from './trip-history/TripHistoryList';
import TripHistoryOptimizedSkeleton from './trip-history/TripHistoryOptimizedSkeleton';
import TripDetailsDialog from './TripDetailsDialog';
import TripEndDialog from './trip-history/TripEndDialog';
import TripDeleteDialog from './trip-history/TripDeleteDialog';

const TripHistoryOptimized = () => {
  // State management
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [tripToEnd, setTripToEnd] = useState(null);
  const [tripToDelete, setTripToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('start_date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Data fetching
  const { data: tripsData, isLoading, error, refetch } = useTripsQuery();
  const trips = tripsData?.trips || [];

  // Refresh data when component mounts (user enters the page)
  useEffect(() => {
    console.log('🗂️ TripHistoryOptimized component mounted, refreshing data');
    refetch();
  }, [refetch]);

  const handleRefresh = async () => {
    await refetch();
  };

  // Handlers for dialogs
  const handleOpenTripDetails = (trip) => setSelectedTrip(trip);
  const handleCloseTripDetails = () => setSelectedTrip(null);
  const handleOpenTripEndDialog = (trip) => setTripToEnd(trip);
  const handleCloseTripEndDialog = () => setTripToEnd(null);
  const handleOpenTripDeleteDialog = (trip) => setTripToDelete(trip);
  const handleCloseTripDeleteDialog = () => setTripToDelete(null);

  // Filtering trips based on search term and active tab
  const filteredTrips = React.useMemo(() => {
    return trips.filter((trip) => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearchTerm =
        (trip.company || '').toLowerCase().includes(searchTermLower) ||
        (trip.destination || '').toLowerCase().includes(searchTermLower);

      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'active' && !trip.end_date) ||
        (activeTab === 'completed' && trip.end_date);

      return matchesSearchTerm && matchesTab;
    });
  }, [trips, searchTerm, activeTab]);

  // Sorting trips
  const sortedTrips = React.useMemo(() => {
    const sorted = [...filteredTrips].sort((a, b) => {
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
        // If types are mixed or not handled, attempt a simple comparison
        return sortOrder === 'asc' ? String(aValue).localeCompare(String(bValue)) : String(bValue).localeCompare(String(aValue));
      }
    });
    return sorted;
  }, [filteredTrips, sortBy, sortOrder]);

  const totalDistance = React.useMemo(() => {
    return trips.reduce((sum, trip) => sum + (trip.distance || 0), 0);
  }, [trips]);

  const totalTrips = trips.length;
  const activeTripsCount = trips.filter(trip => !trip.end_date).length;
  const completedTripsCount = trips.filter(trip => trip.end_date).length;

  if (isLoading) {
    return <TripHistoryOptimizedSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-4">Impossible de charger l'historique des voyages</p>
          <Button onClick={handleRefresh}>Réessayer</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TripHistoryHeader>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un voyage
        </Button>
      </TripHistoryHeader>

      <TripHistoryFilters
        trips={sortedTrips}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      <TripHistoryStats
        trips={sortedTrips}
        totalDistance={totalDistance}
        totalTrips={totalTrips}
        activeTripsCount={activeTripsCount}
        completedTripsCount={completedTripsCount}
      />

      <TripHistoryList
        trips={sortedTrips}
        onTripClick={handleOpenTripDetails}
        onOpenTripDetails={handleOpenTripDetails}
        onOpenTripEndDialog={handleOpenTripEndDialog}
        onOpenTripDeleteDialog={handleOpenTripDeleteDialog}
      />

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
          // Handle delete confirmation
          console.log('Deleting trip:', tripToDelete);
          handleCloseTripDeleteDialog();
          handleRefresh();
        }}
      />
    </div>
  );
};

export default TripHistoryOptimized;
