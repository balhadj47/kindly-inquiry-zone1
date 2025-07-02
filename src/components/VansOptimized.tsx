
import React, { useState, useEffect } from 'react';
import { useVans, useVanMutations } from '@/hooks/useVansOptimized';
import { useVansActions } from '@/hooks/useVansActions';
import { useVansFiltersAndSort } from '@/hooks/useVansFiltersAndSort';
import VansEnhancedHeader from './vans/VansEnhancedHeader';
import VansEnhancedFilters from './vans/VansEnhancedFilters';
import VanEnhancedCard from './vans/VanEnhancedCard';
import VansEnhancedEmptyState from './vans/VansEnhancedEmptyState';
import VanModal from './VanModal';
import { VansLoadingSkeleton } from '@/components/ui/enhanced-loading-skeleton';
import { Van } from '@/types/van';

const VansOptimized = () => {
  const { data: vansData = [], isLoading, error, refetch } = useVans();
  const { deleteVan } = useVanMutations();
  
  // Filter and sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('license_plate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Custom hooks
  const {
    isModalOpen,
    selectedVan,
    handleAddVan,
    handleEditVan,
    handleModalClose,
  } = useVansActions();

  const { filteredAndSortedVans } = useVansFiltersAndSort({
    vans: vansData,
    searchTerm,
    statusFilter,
    sortField,
    sortDirection
  });

  // Force fresh data on component mount
  useEffect(() => {
    console.log('🚐 VansOptimized: Component mounted, forcing fresh data fetch');
    refetch();
  }, [refetch]);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    console.log('🔄 VansOptimized: Manual refresh triggered');
    setIsRefreshing(true);
    
    try {
      await refetch();
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleQuickAction = (van: Van) => {
    console.log('Quick action for van:', van);
  };

  const handleDeleteVan = async (van: Van) => {
    await deleteVan.mutateAsync(van.id);
  };

  const handleModalSuccess = () => {
    refetch();
    handleModalClose();
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  // Show loading only when actually loading
  if (isLoading) {
    return <VansLoadingSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-4">Impossible de charger les camionnettes</p>
          <button 
            onClick={() => refetch()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="space-y-6 p-6">
        <VansEnhancedHeader
          vansCount={vansData.length}
          onAddVan={handleAddVan}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
        
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
                onQuickAction={handleQuickAction}
              />
            ))}
          </div>
        )}
      </div>

      <VanModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        van={selectedVan}
        onSaveSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default VansOptimized;
