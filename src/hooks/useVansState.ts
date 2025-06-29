
import { useVanDelete } from './useVanDelete';
import { useEntityState } from './useEntityState';

export const useVansState = (setVans: () => void) => {
  const { deleteVan } = useVanDelete(() => {
    setVans();
  });

  const entityState = useEntityState({
    onDelete: deleteVan,
    onRefresh: setVans
  });

  return {
    isModalOpen: entityState.isModalOpen,
    setIsModalOpen: entityState.setIsModalOpen,
    isDeleteDialogOpen: entityState.isDeleteDialogOpen,
    setIsDeleteDialogOpen: entityState.setIsDeleteDialogOpen,
    selectedVan: entityState.selectedEntity,
    isDeleting: entityState.isDeleting,
    handleAddVan: entityState.handleAdd,
    handleEditVan: entityState.handleEdit,
    handleDeleteVan: entityState.handleDelete,
    handleConfirmDelete: entityState.handleConfirmDelete,
  };
};
