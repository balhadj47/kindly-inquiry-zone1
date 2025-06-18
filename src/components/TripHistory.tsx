
import React, { useState, useMemo } from 'react';
import { useTrip } from '@/contexts/TripContext';
import { useCompanies } from '@/hooks/useCompanies';
import { useVans } from '@/hooks/useVans';
import TripDetailsDialog from './TripDetailsDialog';
import { useToast } from '@/hooks/use-toast';
import TripHistoryHeader from './trip-history/TripHistoryHeader';
import TripHistoryFilters from './trip-history/TripHistoryFilters';
import TripHistoryStats from './trip-history/TripHistoryStats';
import TripHistoryList from './trip-history/TripHistoryList';
import TripHistoryOptimizedSkeleton from './trip-history/TripHistoryOptimizedSkeleton';

const TripHistory = () => {
  const { trips, deleteTrip, error: tripsError } = useTrip();
  const { companies, error: companiesError } = useCompanies();
  const { vans, error: vansError } = useVans();
  const { toast } = useToast();
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [vanFilter, setVanFilter] = useState('all');
  const [deletingTripId, setDeletingTripId] = useState<number | null>(null);

  // Show loading skeleton while any critical data is loading
  const isLoading = !trips || !companies || !vans;
  const hasError = tripsError || companiesError || vansError;

  const getVanDisplayName = (vanId: string) => {
    const van = vans.find(v => v.id === vanId);
    if (van) {
      return van.license_plate ? `${van.license_plate} - ${van.model}` : van.model;
    }
    return vanId;
  };

  const filteredTrips = useMemo(() => {
    if (!trips || !vans) return [];
    
    return trips.filter(trip => {
      const vanDisplayName = getVanDisplayName(trip.van);
      const matchesSearch = 
        trip.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vanDisplayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.driver.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCompany = companyFilter === 'all' || trip.company === companyFilter;
      const matchesVan = vanFilter === 'all' || trip.van === vanFilter;
      
      return matchesSearch && matchesCompany && matchesVan;
    });
  }, [trips, searchTerm, companyFilter, vanFilter, vans]);

  const handleDeleteTrip = async (tripId: number) => {
    console.log('Delete button clicked for trip:', tripId);
    setDeletingTripId(tripId);
    
    try {
      await deleteTrip(tripId);
      
      toast({
        title: "Succès",
        description: "Le voyage a été supprimé avec succès",
      });
      
      console.log('Trip deleted successfully:', tripId);
    } catch (error) {
      console.error('Error deleting trip:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le voyage",
        variant: "destructive",
      });
    } finally {
      setDeletingTripId(null);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCompanyFilter('all');
    setVanFilter('all');
  };

  // Show loading skeleton
  if (isLoading) {
    return <TripHistoryOptimizedSkeleton />;
  }

  // Show error state
  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-4">Impossible de charger les données</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Actualiser
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TripHistoryHeader />

      <TripHistoryFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        companyFilter={companyFilter}
        setCompanyFilter={setCompanyFilter}
        vanFilter={vanFilter}
        setVanFilter={setVanFilter}
        companies={companies}
        vans={vans}
        onClearFilters={clearFilters}
      />

      <TripHistoryStats trips={trips} />

      <TripHistoryList
        filteredTrips={filteredTrips}
        totalTrips={trips}
        onTripClick={setSelectedTrip}
        onDeleteTrip={handleDeleteTrip}
        deletingTripId={deletingTripId}
      />

      <TripDetailsDialog
        trip={selectedTrip}
        isOpen={!!selectedTrip}
        onClose={() => setSelectedTrip(null)}
      />
    </div>
  );
};

export default TripHistory;
