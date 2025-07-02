
import { useState } from 'react';
import { Van } from '@/types/van';

export const useVansActions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVan, setSelectedVan] = useState<Van | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const handleAddVan = () => {
    setSelectedVan(null);
    setIsModalOpen(true);
  };

  const handleEditVan = (van: Van) => {
    setSelectedVan(van);
    setIsModalOpen(true);
  };

  const handleViewVan = (van: Van) => {
    setSelectedVan(van);
    setIsDetailsDialogOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedVan(null);
  };

  const handleDetailsDialogClose = () => {
    setIsDetailsDialogOpen(false);
    setSelectedVan(null);
  };

  return {
    isModalOpen,
    setIsModalOpen,
    selectedVan,
    setSelectedVan,
    isDetailsDialogOpen,
    setIsDetailsDialogOpen,
    handleAddVan,
    handleEditVan,
    handleViewVan,
    handleModalClose,
    handleDetailsDialogClose,
  };
};
