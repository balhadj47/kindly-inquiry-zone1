
import { useState } from 'react';
import { Trip } from '@/contexts/TripContext';
import { useTrip } from '@/contexts/TripContext';
import { useCommonActions } from '@/hooks/useCommonActions';
import { useDialogState } from '@/hooks/useDialogState';

interface ActionDialogData {
  mission: Trip;
  action: 'delete' | 'terminate';
}

export const useMissionsActions = () => {
  const { refetch } = useTrip();
  const { isRefreshing, handleRefresh } = useCommonActions({
    refetch,
    refreshKeys: ['trips'],
  });

  const {
    dialogState: actionDialog,
    openDialog: openActionDialog,
    closeDialog: closeActionDialog
  } = useDialogState<ActionDialogData>();

  const handleDeleteMission = (mission: Trip) => {
    console.log('🗑️ Missions: Preparing to delete mission:', mission.id);
    openActionDialog({ mission, action: 'delete' });
  };

  const handleTerminateMission = (mission: Trip) => {
    console.log('🔚 Missions: Preparing to terminate mission:', mission.id);
    openActionDialog({ mission, action: 'terminate' });
  };

  const handleActionConfirm = async () => {
    if (!actionDialog.data) return;
    
    try {
      // Implementation for delete/terminate actions
      console.log(`${actionDialog.data.action} mission:`, actionDialog.data.mission.id);
      
      // Close dialog and refresh
      closeActionDialog();
      await handleRefresh();
    } catch (actionError) {
      console.error('Error performing action:', actionError);
    }
  };

  // Legacy compatibility - convert new dialog state to old format
  const legacyActionDialog = {
    isOpen: actionDialog.isOpen,
    mission: actionDialog.data?.mission || null,
    action: actionDialog.data?.action || null
  };

  const setActionDialog = (state: { isOpen: boolean; mission: Trip | null; action: 'delete' | 'terminate' | null }) => {
    if (state.isOpen && state.mission && state.action) {
      openActionDialog({ mission: state.mission, action: state.action });
    } else {
      closeActionDialog();
    }
  };

  return {
    isRefreshing,
    actionDialog: legacyActionDialog,
    setActionDialog,
    handleRefresh,
    handleDeleteMission,
    handleTerminateMission,
    handleActionConfirm
  };
};
