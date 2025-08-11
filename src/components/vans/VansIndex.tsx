
import React, { useState, useMemo } from 'react';
import { useVans, useVanMutations } from '@/hooks/useVansOptimized';
import { useVanDelete } from '@/hooks/useVanDelete';
import { useVansActions } from '@/hooks/useVansActions';
import { useVansFiltersAndSort } from '@/hooks/useVansFiltersAndSort';
import VansEnhancedHeader from './VansEnhancedHeader';
import VansEnhancedFilters from './VansEnhancedFilters';
import VanEnhancedCard from './VanEnhancedCard';
import VansEnhancedEmptyState from './VansEnhancedEmptyState';
import VanModal from '../VanModal';
import VanDeleteDialog from './VanDeleteDialog';
import VanDetailsDialog from './VanDetailsDialog';
import { VansLoadingSkeleton } from '@/components/ui/enhanced-loading-skeleton';
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
  const [sortField, setSortField] = useState('license_plate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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
    sortField,
    sortDirection
  });

  const { deleteVan, confirmDelete, isDeleting, isDeleteDialogOpen, setIsDeleteDialogOpen, vanToDelete } = useVanDelete(refreshVans);

  const handleDeleteVan = (van: Van) => {
    deleteVan(van);
  };

  const handleSaveSuccess = () => {
    refreshVans();
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  if (isLoading) {
    return <VansLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-4">Impossible de charger les véhicules. Veuillez réessayer.</p>
          <button 
            onClick={onRefresh} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gray-50/30">
      {/* Enhanced Header */}
      <div className="flex-shrink-0 p-6 bg-white border-b border-gray-200">
        <VansEnhancedHeader
          vansCount={vans.length}
          onAddVan={handleAddVan}
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
        />
      </div>

      {/* Enhanced Filters */}
      <div className="flex-shrink-0 p-6 bg-white border-b border-gray-200">
        <VansEnhancedFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortField={sortField}
          setSortField={setSortField}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredAndSortedVans.length === 0 ? (
          <VansEnhancedEmptyState 
            searchTerm={searchTerm}
            onAddVan={handleAddVan}
            onClearSearch={searchTerm || statusFilter !== 'all' ? handleClearSearch : undefined}
          />
        ) : (
          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))' }}>
            {filteredAndSortedVans.map((van) => (
              <VanEnhancedCard
                key={van.id}
                van={van}
                onEdit={handleEditVan}
                onDelete={handleDeleteVan}
                onQuickAction={handleViewVan}
              />
            ))}
          </div>
        )}
      </div>

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
      />
    </div>
  );
};

export default VansIndex;
