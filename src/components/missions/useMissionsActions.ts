
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

  const { refreshTrips } = useTrip();

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
      // Handle the actual action here based on actionDialog.action
      // This would typically call the appropriate service methods
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
