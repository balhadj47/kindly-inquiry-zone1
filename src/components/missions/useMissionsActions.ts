
import { useState } from 'react';
import { useTrip } from '@/contexts/TripContext';
import { Trip } from '@/contexts/TripContext';

interface ActionDialog {
  isOpen: boolean;
  mission: Trip | null;
  action: 'delete' | 'terminate' | null;
}

export const useMissionsActions = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionDialog, setActionDialog] = useState<ActionDialog>({
    isOpen: false,
    mission: null,
    action: null
  });

  const { refreshTrips, deleteTrip } = useTrip();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshTrips();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDeleteMission = (mission: Trip) => {
    setActionDialog({
      isOpen: true,
      mission,
      action: 'delete'
    });
  };

  const handleTerminateMission = (mission: Trip) => {
    setActionDialog({
      isOpen: true,
      mission,
      action: 'terminate'
    });
  };

  const handleActionConfirm = async () => {
    if (!actionDialog.mission || !actionDialog.action) return;

    setIsRefreshing(true);
    try {
      if (actionDialog.action === 'delete') {
        await deleteTrip(actionDialog.mission.id);
      }
      // Handle other actions like 'terminate' if needed
      await handleRefresh();
    } finally {
      setIsRefreshing(false);
      setActionDialog({ isOpen: false, mission: null, action: null });
    }
  };

  return {
    isRefreshing,
    actionDialog,
    setActionDialog,
    handleRefresh,
    handleDeleteMission,
    handleTerminateMission,
    handleActionConfirm
  };
};
