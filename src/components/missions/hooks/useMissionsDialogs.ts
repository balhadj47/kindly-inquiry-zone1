
import { useState, useCallback } from 'react';
import { Trip } from '@/contexts/TripContext';

export const useMissionsDialogs = () => {
  const [terminateDialog, setTerminateDialog] = useState<{
    isOpen: boolean;
    mission: Trip | null;
  }>({ isOpen: false, mission: null });

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    mission: Trip | null;
  }>({ isOpen: false, mission: null });

  const handleTerminateClick = useCallback((mission: Trip) => {
    setTerminateDialog({
      isOpen: true,
      mission
    });
  }, []);

  const handleTerminateClose = useCallback(() => {
    setTerminateDialog({
      isOpen: false,
      mission: null
    });
  }, []);

  const handleDeleteClick = useCallback((mission: Trip) => {
    setDeleteDialog({
      isOpen: true,
      mission
    });
  }, []);

  const handleDeleteClose = useCallback(() => {
    setDeleteDialog({
      isOpen: false,
      mission: null
    });
  }, []);

  return {
    terminateDialog,
    deleteDialog,
    handleTerminateClick,
    handleTerminateClose,
    handleDeleteClick,
    handleDeleteClose,
  };
};
