
import { useState, useCallback } from 'react';
import { useDialogState } from '@/hooks/useDialogState';

interface UseEntityStateOptions<T> {
  onDelete?: (entity: T) => void;
  onRefresh?: () => void;
}

export const useEntityState = <T extends { id: string | number }>(
  options: UseEntityStateOptions<T> = {}
) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Modal state
  const {
    isOpen: isModalOpen,
    openDialog: openModal,
    closeDialog: closeModal
  } = useDialogState<T>();

  // Delete dialog state
  const {
    isOpen: isDeleteDialogOpen,
    data: selectedEntity,
    openDialog: openDeleteDialog,
    closeDialog: closeDeleteDialog
  } = useDialogState<T>();

  const handleAdd = useCallback(() => {
    openModal(null as any);
  }, [openModal]);

  const handleEdit = useCallback((entity: T) => {
    openModal(entity);
  }, [openModal]);

  const handleDelete = useCallback((entity: T) => {
    openDeleteDialog(entity);
  }, [openDeleteDialog]);

  const handleConfirmDelete = useCallback(async () => {
    if (selectedEntity && options.onDelete) {
      setIsDeleting(true);
      try {
        await options.onDelete(selectedEntity);
        closeDeleteDialog();
        options.onRefresh?.();
      } catch (error) {
        console.error('Error deleting entity:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  }, [selectedEntity, options, closeDeleteDialog]);

  const handleModalSuccess = useCallback(() => {
    closeModal();
    options.onRefresh?.();
  }, [closeModal, options]);

  return {
    // Modal state
    isModalOpen,
    setIsModalOpen: (open: boolean) => open ? openModal(null as any) : closeModal(),
    selectedEntity,
    
    // Delete state
    isDeleteDialogOpen,
    setIsDeleteDialogOpen: (open: boolean) => open ? (selectedEntity && openDeleteDialog(selectedEntity)) : closeDeleteDialog(),
    isDeleting,
    
    // Actions
    handleAdd,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    handleModalSuccess,
  };
};
