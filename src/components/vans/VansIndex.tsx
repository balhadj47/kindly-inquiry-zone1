
import React, { useState } from 'react';
import VansHeader from './VansHeader';
import VansSearch from './VansSearch';
import VansEmptyState from './VansEmptyState';
import VansGrid from './VansGrid';
import VanModal from '../VanModal';
import VanDeleteDialog from './VanDeleteDialog';
import { useVans } from '@/hooks/useVans';
import { useVanDelete } from '@/hooks/useVanDelete';
import { useVansState } from '@/hooks/useVansState';

const VansIndex = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { vans, refetch } = useVans();
  const { deleteVan } = useVanDelete(() => refetch());
  
  const setVans = () => {
    refetch();
  };

  const {
    isModalOpen,
    setIsModalOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedVan,
    isDeleting,
    handleAddVan,
    handleEditVan,
    handleDeleteVan,
    handleConfirmDelete
  } = useVansState(setVans);

  const filteredVans = vans.filter(van =>
    van.license_plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    van.model?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleModalSuccess = () => {
    refetch();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <VansHeader onAddVan={handleAddVan} />
      
      <VansSearch 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />

      {filteredVans.length === 0 ? (
        <VansEmptyState 
          searchTerm={searchTerm} 
          onAddVan={handleAddVan} 
        />
      ) : (
        <VansGrid
          vans={filteredVans}
          onEditVan={handleEditVan}
          onDeleteVan={handleDeleteVan}
        />
      )}

      <VanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        van={selectedVan}
        onSaveSuccess={handleModalSuccess}
      />

      <VanDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        van={selectedVan}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default VansIndex;
