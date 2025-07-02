
import React, { useState, useEffect } from 'react';
import { useVans, useVanMutations } from '@/hooks/useVansOptimized';
import { useVansActions } from '@/hooks/useVansActions';
import { useVansFiltersAndSort } from '@/hooks/useVansFiltersAndSort';
import VansHeader from './vans/VansHeader';
import VansActions from './vans/VansActions';
import VansFiltersSection from './vans/VansFiltersSection';
import VanList from './VanList';
import VanModal from './VanModal';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Van } from '@/types/van';

const VansLoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-6 w-32" />
      </div>
      <Skeleton className="h-12 w-12 mt-4 lg:mt-0" />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg border p-6 animate-pulse">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Skeleton className="h-6 w-32 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="flex space-x-2 mt-4">
            <Skeleton className="h-8 flex-1" />
            <Skeleton className="h-8 flex-1" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

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

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
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
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Camionnettes</h1>
        <div className="flex items-center space-x-2 mt-4 lg:mt-0">
          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            variant="outline"
            size="icon"
            className="bg-black text-white hover:bg-gray-800 border-black"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <VansActions 
            onCreateVan={handleAddVan}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />
        </div>
      </div>
      
      <VansFiltersSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
      />

      <VanList
        vans={filteredAndSortedVans}
        totalVans={vansData.length}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onAddVan={handleAddVan}
        onEditVan={handleEditVan}
        onQuickAction={handleQuickAction}
        onDeleteVan={handleDeleteVan}
      />

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
