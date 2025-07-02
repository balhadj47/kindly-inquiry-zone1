
import { useState } from 'react';
import { Van } from '@/types/van';

export const useVansIndexState = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVan, setSelectedVan] = useState<Van | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  return {
    isModalOpen,
    setIsModalOpen,
    selectedVan,
    setSelectedVan,
    isDetailsDialogOpen,
    setIsDetailsDialogOpen,
  };
};
