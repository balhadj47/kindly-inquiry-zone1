
import { useState, useCallback } from 'react';
import { Trip } from '@/contexts/TripContext';
import { useVans } from '@/hooks/useVansOptimized';
import { useTripMutations } from '@/hooks/trips/useTripMutations';
import { useToast } from '@/hooks/use-toast';
import { useFilteredData } from '@/hooks/useFilteredData';
import { useDialogState } from '@/hooks/useDialogState';

export const useMissionsListLogic = (missions: Trip[], externalSearchTerm: string, statusFilter: string) => {
  const [finalKm, setFinalKm] = useState('');
  const [isTerminating, setIsTerminating] = useState(false);
  const [deletingMissionId, setDeletingMissionId] = useState<number | null>(null);

  const { data: vans = [] } = useVans();
  const { updateTrip, deleteTrip } = useTripMutations();
  const { toast } = useToast();

  // Use consolidated filtering hook
  const { filteredData: filteredMissions } = useFilteredData({
    data: missions,
    searchTerm: externalSearchTerm,
    searchFields: ['company', 'branch', 'driver', 'van'],
    statusFilter,
    statusField: 'status',
    debounceMs: 300
  });

  // Use consolidated dialog state management
  const {
    dialogState: detailsDialog,
    openDialog: openDetailsDialog,
    closeDialog: closeDetailsDialog
  } = useDialogState<Trip>();

  const {
    dialogState: terminateDialog,
    openDialog: openTerminateDialog,
    closeDialog: closeTerminateDialog
  } = useDialogState<Trip>();

  const getVanDisplayName = useCallback((vanId: string) => {
    const van = vans.find(v => v.id === vanId || v.reference_code === vanId);
    if (van) {
      return van.license_plate ? `${van.license_plate} (${van.model})` : van.model;
    }
    return vanId;
  }, [vans]);

  return {
    // Legacy compatibility
    selectedMission: detailsDialog.data,
    setSelectedMission: (mission: Trip | null) => {
      if (mission) openDetailsDialog(mission);
      else closeDetailsDialog();
    },
    isDetailsDialogOpen: detailsDialog.isOpen,
    setIsDetailsDialogOpen: (open: boolean) => {
      if (!open) closeDetailsDialog();
    },
    showTerminatePrompt: terminateDialog.isOpen,
    setShowTerminatePrompt: (open: boolean) => {
      if (!open) closeTerminateDialog();
    },
    terminateMission: terminateDialog.data,
    setTerminateMission: (mission: Trip | null) => {
      if (mission) openTerminateDialog(mission);
      else closeTerminateDialog();
    },
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
