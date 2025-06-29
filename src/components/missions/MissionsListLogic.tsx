
import { useState, useMemo, useCallback } from 'react';
import { Trip } from '@/contexts/TripContext';
import { useVans } from '@/hooks/useVansOptimized';
import { useTripMutations } from '@/hooks/trips/useTripMutations';
import { useToast } from '@/hooks/use-toast';
import { useOptimizedSearch } from '@/hooks/useOptimizedSearch';

export const useMissionsListLogic = (missions: Trip[], externalSearchTerm: string, statusFilter: string) => {
  const [selectedMission, setSelectedMission] = useState<Trip | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [showTerminatePrompt, setShowTerminatePrompt] = useState(false);
  const [terminateMission, setTerminateMission] = useState<Trip | null>(null);
  const [finalKm, setFinalKm] = useState('');
  const [isTerminating, setIsTerminating] = useState(false);
  const [deletingMissionId, setDeletingMissionId] = useState<number | null>(null);

  const { data: vans = [] } = useVans();
  const { updateTrip, deleteTrip } = useTripMutations();
  const { toast } = useToast();

  // Use optimized search for better performance
  const { filteredData: searchFilteredMissions } = useOptimizedSearch({
    data: missions,
    searchFields: ['company', 'branch', 'driver', 'van'],
    debounceMs: 300
  });

  // Memoize filtered missions to avoid recalculation
  const filteredMissions = useMemo(() => {
    let result = searchFilteredMissions;

    // Apply external search term if provided
    if (externalSearchTerm && externalSearchTerm.trim()) {
      const lowerSearch = externalSearchTerm.toLowerCase();
      result = result.filter(mission => 
        mission.company.toLowerCase().includes(lowerSearch) ||
        mission.branch.toLowerCase().includes(lowerSearch) ||
        mission.driver.toLowerCase().includes(lowerSearch) ||
        mission.van.toLowerCase().includes(lowerSearch)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(mission => {
        switch (statusFilter) {
          case 'active':
            return mission.status === 'active';
          case 'completed':
            return mission.status === 'completed';
          case 'terminated':
            return mission.status === 'terminated';
          default:
            return true;
        }
      });
    }

    return result;
  }, [searchFilteredMissions, externalSearchTerm, statusFilter]);

  const getVanDisplayName = useCallback((vanId: string) => {
    const van = vans.find(v => v.id === vanId || v.reference_code === vanId);
    if (van) {
      return van.license_plate ? `${van.license_plate} (${van.model})` : van.model;
    }
    return vanId;
  }, [vans]);

  return {
    selectedMission,
    setSelectedMission,
    isDetailsDialogOpen,
    setIsDetailsDialogOpen,
    showTerminatePrompt,
    setShowTerminatePrompt,
    terminateMission,
    setTerminateMission,
    finalKm,
    setFinalKm,
    isTerminating,
    setIsTerminating,
    deletingMissionId,
    setDeletingMissionId,
    filteredMissions,
    getVanDisplayName,
    updateTrip,
    deleteTrip,
    toast
  };
};
