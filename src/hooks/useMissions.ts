import { useState } from 'react';
import { Trip } from '@/contexts/TripContext';

export const useMissions = () => {
  const [selectedMission, setSelectedMission] = useState<Trip | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  return {
    selectedMission,
    setSelectedMission,
    isDetailsDialogOpen,
    setIsDetailsDialogOpen
  };
};