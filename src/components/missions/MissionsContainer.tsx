
import React, { useState, useMemo } from 'react';
import { useTrip } from '@/contexts/TripContext';
import { useVans } from '@/hooks/useVans';
import { useCompanies } from '@/hooks/useCompanies';
import { useRBAC } from '@/contexts/RBACContext';
import { useToast } from '@/hooks/use-toast';
import { Trip } from '@/contexts/TripContext';
import MissionsFilters from './MissionsFilters';
import MissionsList from './MissionsList';
import MissionsLoadingSkeleton from './MissionsLoadingSkeleton';
import MissionDetailsDialog from './MissionDetailsDialog';
import MissionActionDialog from './MissionActionDialog';
import NewTripDialog from '@/components/NewTripDialog';

interface MissionsContainerProps {
  isNewMissionDialogOpen: boolean;
  setIsNewMissionDialogOpen: (open: boolean) => void;
}

const MissionsContainer: React.FC<MissionsContainerProps> = ({
  isNewMissionDialogOpen,
  setIsNewMissionDialogOpen
}) => {
  console.log('🚀 MissionsContainer: Component rendering...');

  // State management
  const [selectedMission, setSelectedMission] = useState<Trip | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [vanFilter, setVanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deletingTripId, setDeletingTripId] = useState<number | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<'delete' | 'terminate' | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Data fetching
  const { trips, isLoading, error, deleteTrip, endTrip } = useTrip();
  const { vans } = useVans();
  const { companies } = useCompanies();
  const { hasPermission } = useRBAC();
  const { toast } = useToast();

  console.log('🚀 MissionsContainer: Raw trips data:', trips);

  // Process trips data safely
  const processedTrips = useMemo(() => {
    try {
      if (!Array.isArray(trips)) {
        console.warn('🚀 MissionsContainer: trips is not an array:', trips);
        return [];
      }

      return trips.map(trip => {
        try {
          if (!trip) {
            console.warn('🚀 MissionsContainer: Found null trip');
            return null;
          }

          const processDate = (dateObj: any) => {
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
              console.warn('🚀 MissionsContainer: Error processing date:', err, dateObj);
              return null;
            }
          };

          return {
            ...trip,
            startDate: processDate(trip.startDate),
            endDate: processDate(trip.endDate)
          };
        } catch (dateError) {
          console.error('🚀 MissionsContainer: Error processing trip:', dateError, trip);
          return {
            ...trip,
            startDate: null,
            endDate: null
          };
        }
      }).filter(Boolean);
    } catch (error) {
      console.error('🚀 MissionsContainer: Error processing trips:', error);
      return [];
    }
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
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && trip.status === 'active') ||
        (statusFilter === 'completed' && trip.status !== 'active');

      return matchesSearchTerm && matchesCompany && matchesVan && matchesStatus;
    });
  }, [processedTrips, searchTerm, companyFilter, vanFilter, statusFilter]);

  const getVanDisplayName = (vanId: string) => {
    try {
      if (!vanId) return 'N/A';
      const van = vans.find(v => v.id === vanId);
      if (van) {
        return (van as any).reference_code || van.license_plate || van.model || vanId;
      }
      return vanId;
    } catch (error) {
      console.error('🚀 MissionsContainer: Error getting van display name:', error);
      return vanId || 'N/A';
    }
  };

  // Event handlers
  const handleOpenMissionDetails = (mission: Trip) => {
    console.log('🚀 MissionsContainer: Opening mission details for:', mission);
    setSelectedMission(mission);
    setIsDetailsDialogOpen(true);
  };

  const handleDelete = (mission: Trip) => {
    setSelectedMission(mission);
    setCurrentAction('delete');
    setIsActionDialogOpen(true);
  };

  const handleTerminate = (mission: Trip) => {
    setSelectedMission(mission);
    setCurrentAction('terminate');
    setIsActionDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedMission || !currentAction) return;

    setIsActionLoading(true);
    try {
      if (currentAction === 'delete') {
        await deleteTrip(selectedMission.id);
        toast({
          title: 'Mission supprimée',
          description: 'La mission a été supprimée avec succès.',
        });
      } else if (currentAction === 'terminate') {
        const endKm = (selectedMission.startKm || 0) + 1;
        await endTrip(selectedMission.id, endKm);
        toast({
          title: 'Mission terminée',
          description: 'La mission a été terminée avec succès.',
        });
      }
      
      setIsActionDialogOpen(false);
      setSelectedMission(null);
      setCurrentAction(null);
    } catch (error) {
      console.error('🚀 MissionsContainer: Error during action:', error);
      toast({
        title: 'Erreur',
        description: `Impossible de ${currentAction === 'delete' ? 'supprimer' : 'terminer'} la mission.`,
        variant: 'destructive',
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCompanyFilter('all');
    setVanFilter('all');
    setStatusFilter('all');
  };

  const canCreateMissions = hasPermission('missions:create');

  if (isLoading) {
    return <MissionsLoadingSkeleton />;
  }

  if (error) {
    console.error('🚀 MissionsContainer: Error state:', error);
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-4">Impossible de charger les missions: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Filters */}
      <MissionsFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        companyFilter={companyFilter}
        setCompanyFilter={setCompanyFilter}
        vanFilter={vanFilter}
        setVanFilter={setVanFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        companies={companies}
        vans={vans}
        onClearFilters={handleClearFilters}
      />

      {/* Mission List */}
      <MissionsList
        filteredTrips={filteredTrips}
        totalTrips={processedTrips}
        onTripClick={handleOpenMissionDetails}
        onDeleteTrip={handleDelete}
        onTerminateTrip={handleTerminate}
        deletingTripId={deletingTripId}
        getVanDisplayName={getVanDisplayName}
      />

      {/* New Mission Dialog */}
      <NewTripDialog
        isOpen={isNewMissionDialogOpen}
        onClose={() => setIsNewMissionDialogOpen(false)}
      />

      {/* Mission Details Dialog */}
      <MissionDetailsDialog
        mission={selectedMission}
        isOpen={isDetailsDialogOpen}
        onClose={() => {
          setIsDetailsDialogOpen(false);
          setSelectedMission(null);
        }}
        getVanDisplayName={getVanDisplayName}
      />

      {/* Mission Action Dialog */}
      <MissionActionDialog
        mission={selectedMission}
        action={currentAction}
        isOpen={isActionDialogOpen}
        onClose={() => {
          setIsActionDialogOpen(false);
          setSelectedMission(null);
          setCurrentAction(null);
        }}
        onConfirm={handleConfirmAction}
        isLoading={isActionLoading}
      />
    </>
  );
};

export default MissionsContainer;
