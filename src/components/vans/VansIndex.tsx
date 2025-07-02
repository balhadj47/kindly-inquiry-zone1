
import React, { useState, useMemo } from 'react';
import { useVans, useVanMutations } from '@/hooks/useVansOptimized';
import { useVanDelete } from '@/hooks/useVanDelete';
import { useVansActions } from '@/hooks/useVansActions';
import { useVansFiltersAndSort } from '@/hooks/useVansFiltersAndSort';
import VansHeader from './VansHeader';
import VansActions from './VansActions';
import VansFiltersSection from './VansFiltersSection';
import VansContentSection from './VansContentSection';
import VanModal from '../VanModal';
import VanDeleteDialog from './VanDeleteDialog';
import VanDetailsDialog from './VanDetailsDialog';
import { Van } from '@/types/van';

interface VansIndexProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

const VansIndex = ({ onRefresh, isRefreshing }: VansIndexProps) => {
  const { data: vans = [], isLoading, error } = useVans();
  const { refreshVans } = useVanMutations();
  
  // Filter and sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Custom hooks
  const {
    isModalOpen,
    selectedVan,
    isDetailsDialogOpen,
    handleAddVan,
    handleEditVan,
    handleViewVan,
    handleModalClose,
    handleDetailsDialogClose,
  } = useVansActions();

  const { filteredAndSortedVans } = useVansFiltersAndSort({
    vans,
    searchTerm,
    statusFilter,
    sortField: 'license_plate',
    sortDirection: 'asc'
  });

  const { deleteVan, confirmDelete, isDeleting, isDeleteDialogOpen, setIsDeleteDialogOpen, vanToDelete } = useVanDelete(refreshVans);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedVans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVans = filteredAndSortedVans.slice(startIndex, endIndex);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleDeleteVan = (van: Van) => {
    deleteVan(van);
  };

  const handleSaveSuccess = () => {
    refreshVans();
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2 text-red-600">Erreur de chargement</h2>
        <p className="text-gray-600">Impossible de charger les véhicules. Veuillez réessayer.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-4 sm:p-6 border-b">
        <div className="flex justify-between items-center">
          <VansHeader vansCount={vans.length} />
          <VansActions 
            onCreateVan={handleAddVan}
            onRefresh={onRefresh}
            isRefreshing={isRefreshing}
          />
        </div>
      </div>

      {/* Search and Filters - Fixed */}
      <VansFiltersSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortField="license_plate"
        setSortField={() => {}}
        sortDirection="asc"
        setSortDirection={() => {}}
      />

      {/* Content Area - Scrollable */}
      <VansContentSection
        paginatedVans={paginatedVans}
        filteredVansCount={filteredAndSortedVans.length}
        currentPage={currentPage}
        totalPages={totalPages}
        searchTerm={searchTerm}
        onPageChange={setCurrentPage}
        onEditVan={handleEditVan}
        onDeleteVan={handleDeleteVan}
        onQuickAction={handleViewVan}
        onAddVan={handleAddVan}
      />

      {/* Modals */}
      <VanModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        van={selectedVan}
        onSaveSuccess={handleSaveSuccess}
      />

      <VanDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        van={vanToDelete}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />

      <VanDetailsDialog
        van={selectedVan}
        isOpen={isDetailsDialogOpen}
        onClose={handleDetailsDialogClose}
        onEdit={handleEditVan}
      />
    </div>
  );
};

export default VansIndex;
