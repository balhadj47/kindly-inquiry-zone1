
import { useState } from 'react';
import { Trip } from '@/contexts/TripContext';
import { useCacheRefresh } from '@/hooks/useCacheRefresh';
import { useTrip } from '@/contexts/TripContext';

export const useMissionsActions = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionDialog, setActionDialog] = useState<{
    isOpen: boolean;
    mission: Trip | null;
    action: 'delete' | 'terminate' | null;
  }>({
    isOpen: false,
    mission: null,
    action: null
  });

  const { refetch } = useTrip();
  const { refreshPage } = useCacheRefresh();

  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      if (refetch && typeof refetch === 'function') {
        await refetch();
      }
      if (refreshPage && typeof refreshPage === 'function') {
        await refreshPage(['trips']);
      }
    } catch (refreshError) {
      console.error('Error refreshing:', refreshError);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleDeleteMission = (mission: Trip) => {
    console.log('🗑️ Missions: Preparing to delete mission:', mission.id);
    setActionDialog({ isOpen: true, mission, action: 'delete' });
  };

  const handleTerminateMission = (mission: Trip) => {
    console.log('🔚 Missions: Preparing to terminate mission:', mission.id);
    setActionDialog({ isOpen: true, mission, action: 'terminate' });
  };

  const handleActionConfirm = async () => {
    if (!actionDialog.mission) return;
    
    try {
      // Implementation for delete/terminate actions
      console.log(`${actionDialog.action} mission:`, actionDialog.mission.id);
      
      // Close dialog and refresh
      setActionDialog({ isOpen: false, mission: null, action: null });
      await handleRefresh();
    } catch (actionError) {
      console.error('Error performing action:', actionError);
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
