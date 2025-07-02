
import React, { useState, useMemo } from 'react';
import { useVans, useVanMutations } from '@/hooks/useVansOptimized';
import { useVanDelete } from '@/hooks/useVanDelete';
import VansHeader from './VansHeader';
import VansActions from './VansActions';
import VansSearch from './VansSearch';
import VanFilters from './VanFilters';
import VanListGrid from './VanListGrid';
import VanListPagination from './VanListPagination';
import VanListSummary from './VanListSummary';
import VanModal from '../VanModal';
import VanDeleteDialog from './VanDeleteDialog';
import VanDetailsDialog from './VanDetailsDialog';
import VansEmptyState from './VansEmptyState';
import { useVansIndexState } from '@/hooks/useVansIndexState';
import { useVansPagination } from '@/hooks/useVansPagination';
import { useVansFiltering } from '@/hooks/useVansFiltering';
import { Van } from '@/types/van';

interface VansIndexProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

const VansIndex = ({ onRefresh, isRefreshing }: VansIndexProps) => {
  const { data: vans = [], isLoading, error } = useVans();
  const { refreshVans } = useVanMutations();
  
  const {
    isModalOpen,
    setIsModalOpen,
    selectedVan,
    setSelectedVan,
    isDetailsDialogOpen,
    setIsDetailsDialogOpen,
  } = useVansIndexState();

  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    clearFilters,
  } = useVansFiltering();

  const { deleteVan, confirmDelete, isDeleting, isDeleteDialogOpen, setIsDeleteDialogOpen, vanToDelete } = useVanDelete(refreshVans);

  // Filter vans based on search and status
  const filteredVans = useMemo(() => {
    return vans.filter(van => {
      const matchesSearch = !searchTerm || 
        van.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        van.license_plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        van.reference_code?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || van.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [vans, searchTerm, statusFilter]);

  const {
    currentPage,
    setCurrentPage,
    paginatedVans,
    totalPages,
    startIndex,
    endIndex
  } = useVansPagination(filteredVans);

  const handleCreateVan = () => {
    console.log('🚐 VansIndex: Creating new van');
    setSelectedVan(null);
    setIsModalOpen(true);
  };

  const handleEditVan = (van: Van) => {
    console.log('🚐 VansIndex: Editing van:', van);
    console.log('🚐 VansIndex: Van properties:', {
      id: van.id,
      reference_code: van.reference_code,
      model: van.model,
      license_plate: van.license_plate,
      status: van.status,
      insurer: van.insurer,
      insurance_date: van.insurance_date,
      control_date: van.control_date,
      notes: van.notes
    });
    setSelectedVan(van);
    setIsModalOpen(true);
  };

  const handleDeleteVan = (van: Van) => {
    console.log('🚐 VansIndex: Deleting van:', van);
    deleteVan(van);
  };

  const handleViewVan = (van: Van) => {
    console.log('🚐 VansIndex: Viewing van:', van);
    setSelectedVan(van);
    setIsDetailsDialogOpen(true);
  };

  const handleModalClose = () => {
    console.log('🚐 VansIndex: Modal closing, selected van was:', selectedVan);
    setIsModalOpen(false);
    setSelectedVan(null);
  };

  const handleSaveSuccess = () => {
    console.log('🚐 VansIndex: Save successful, refreshing data');
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

  if (vans.length === 0 && !isLoading) {
    return <VansEmptyState searchTerm={searchTerm} onAddVan={handleCreateVan} />;
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-4 sm:p-6 border-b">
        <div className="flex justify-between items-center">
          <VansHeader onAddVan={handleCreateVan} vansCount={vans.length} />
          <VansActions 
            onCreateVan={handleCreateVan}
            onRefresh={onRefresh}
            isRefreshing={isRefreshing}
          />
        </div>
      </div>

      {/* Search and Filters - Fixed */}
      <div className="flex-shrink-0 p-4 sm:p-6 border-b">
        <div className="space-y-4">
          <VansSearch 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          <VanFilters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            sortField="license_plate"
            setSortField={() => {}}
            sortDirection="asc"
            setSortDirection={() => {}}
          />
        </div>
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6">
          <VanListSummary 
            displayedCount={paginatedVans.length}
            filteredCount={filteredVans.length}
            currentPage={currentPage}
            totalPages={totalPages}
          />
          
          <div className="mt-4">
            <VanListGrid 
              vans={paginatedVans}
              onEditVan={handleEditVan}
              onDeleteVan={handleDeleteVan}
              onQuickAction={handleViewVan}
            />
          </div>
          
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <VanListPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
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
        onClose={() => {
          setIsDetailsDialogOpen(false);
          setSelectedVan(null);
        }}
        onEdit={handleEditVan}
      />
    </div>
  );
};

export default VansIndex;
