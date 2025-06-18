
import { useState } from 'react';
import { useVanDelete } from './useVanDelete';

export const useVansState = (setVans: () => void) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVan, setSelectedVan] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { deleteVan } = useVanDelete(() => {
    setVans();
    setIsDeleting(false);
  });

  const handleAddVan = () => {
    setSelectedVan(null);
    setIsModalOpen(true);
  };

  const handleEditVan = (van: any) => {
    setSelectedVan(van);
    setIsModalOpen(true);
  };

  const handleDeleteVan = (van: any) => {
    setSelectedVan(van);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedVan) {
      setIsDeleting(true);
      await deleteVan(selectedVan);
      setIsDeleteDialogOpen(false);
      setSelectedVan(null);
    }
  };

  return {
    isModalOpen,
    setIsModalOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedVan,
    isDeleting,
    handleAddVan,
    handleEditVan,
    handleDeleteVan,
    handleConfirmDelete,
  };
};
