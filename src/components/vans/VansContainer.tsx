
import React, { useState } from 'react';
import { useVans, useVanMutations } from '@/hooks/useVansOptimized';
import { useVanDelete } from '@/hooks/useVanDelete';
import { useVansActions } from '@/hooks/useVansActions';
import { useVansFiltersAndSort } from '@/hooks/useVansFiltersAndSort';
import VansHeader from './VansHeader';
import VansActions from './VansActions';
import VansList from './VansList';
import VansFilters from './VansFilters';
import VanModal from '../VanModal';
import VanDeleteDialog from './VanDeleteDialog';
import VanDetailsDialog from './VanDetailsDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Van } from '@/types/van';
import { useCacheRefresh } from '@/hooks/useCacheRefresh';

const VansContainer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('license_plate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { refreshPage } = useCacheRefresh();
  
  console.log('🚐 VansContainer: Starting to fetch vans data');
  
  const { data: vansData = [], refetch, error } = useVans();
  const { refreshVans } = useVanMutations();
  
  console.log('🚐 VansContainer: Raw vans data:', {
    data: vansData,
    dataType: typeof vansData,
    isArray: Array.isArray(vansData),
    length: vansData?.length || 0,
    error: error
  });

  const { filteredAndSortedVans } = useVansFiltersAndSort({
    vans: vansData,
    searchTerm,
    statusFilter,
    sortField,
    sortDirection
  });

  // Enhanced refresh function that forces cache invalidation
  const handleRefresh = async () => {
    console.log('🔄 VansContainer: Manual refresh triggered');
    await refreshPage(['vans']);
    await refetch();
  };

  const {
    isModalOpen,
    setIsModalOpen,
    selectedVan,
    isDetailsDialogOpen,
    handleAddVan,
    handleEditVan,
    handleViewVan,
    handleModalClose,
    handleDetailsDialogClose,
  } = useVansActions();

  const { deleteVan, confirmDelete, isDeleting, isDeleteDialogOpen, setIsDeleteDialogOpen, vanToDelete } = 
    useVanDelete(handleRefresh);

  const handleDeleteVan = (van: Van) => {
    deleteVan(van);
  };

  const handleSaveSuccess = () => {
    refreshVans();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  console.log('🚐 VansContainer: Final state:', {
    vansCount: vansData.length,
    searchTerm,
    statusFilter,
    isModalOpen,
    selectedVan: selectedVan?.id || 'none'
  });

  if (error) {
    console.error('❌ VansContainer: Error fetching vans:', error);
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2 text-red-600">Erreur de chargement</h2>
        <p className="text-gray-600">Impossible de charger les véhicules. Veuillez réessayer.</p>
        <button 
          onClick={handleRefresh} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Use only the filtered and sorted vans from the hook - no duplicate filtering
  const displayedVans = filteredAndSortedVans;

  console.log('🔍 VansContainer: Search debugging:', {
    searchTerm,
    totalVans: vansData.length,
    filteredVans: displayedVans.length,
    sampleVan: vansData[0] ? {
      license_plate: vansData[0].license_plate,
      model: vansData[0].model,
      reference_code: vansData[0].reference_code
    } : null
  });

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      {/* Dialogs positioned at the top */}
      <VanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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

      <div className="flex items-center justify-between">
        <VansHeader vansCount={vansData.length} />
        <VansActions 
          onCreateVan={handleAddVan}
          onRefresh={handleRefresh}
        />
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <VansFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            sortField={sortField}
            setSortField={setSortField}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            clearFilters={clearFilters}
            vans={vansData}
          />
        </CardContent>
      </Card>

      <VansList
        vans={displayedVans}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onEditVan={handleEditVan}
        onDeleteVan={handleDeleteVan}
        onViewVan={handleViewVan}
      />
    </div>
  );
};

export default VansContainer;
