
import React, { useState, useMemo, useEffect } from 'react';
import { useVans, useVanMutations } from '@/hooks/useVansOptimized';
import { updateVanFields, shouldRefreshVans } from '@/utils/vanFieldUpdater';
import VanStats from './VanStats';
import VanFilters from './VanFilters';
import VanList from './VanList';
import VanModal from './VanModal';
import { Skeleton } from '@/components/ui/skeleton';
import { useCacheRefresh } from '@/hooks/useCacheRefresh';
import { RefreshButton } from '@/components/ui/refresh-button';
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
  const { data: serverVans = [], isLoading, error, refetch } = useVans();
  const { deleteVan } = useVanMutations();
  const [localVans, setLocalVans] = useState<Van[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('license_plate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVan, setSelectedVan] = useState(null);
  const { refreshPage } = useCacheRefresh();

  // Auto-refresh and selective update when server data changes
  useEffect(() => {
    console.log('🚐 VansOptimized: Server data changed, checking for updates...');
    if (shouldRefreshVans(localVans, serverVans)) {
      console.log('🚐 VansOptimized: Updating vans with selective field updates...');
      updateVanFields(localVans, serverVans, setLocalVans);
      if (!hasInitialized) {
        setHasInitialized(true);
      }
    }
  }, [serverVans.length, hasInitialized]); // Remove localVans from dependency

  // Clear cache and refresh data when component mounts
  useEffect(() => {
    console.log('🚐 VansOptimized: Page entered, refreshing data...');
    setHasInitialized(false); // Reset initialization flag
    refreshPage(['vans']);
    refetch();
  }, [refreshPage, refetch]);

  const handleRefresh = async () => {
    refreshPage(['vans']);
    await refetch();
  };

  // Use local vans for display
  const vansToUse = localVans.length > 0 ? localVans : serverVans;

  if (isLoading && vansToUse.length === 0) {
    return <VansLoadingSkeleton />;
  }

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

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedVans = useMemo(() => {
    let filtered = vansToUse.filter(van => {
      if (!van || typeof van !== 'object') return false;
      const licensePlateStr = typeof van.license_plate === 'string' ? van.license_plate : '';
      const modelStr = typeof van.model === 'string' ? van.model : '';
      return (
        licensePlateStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        modelStr.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    if (statusFilter !== 'all') {
      filtered = filtered.filter(van => {
        const vanStatus = typeof van.status === 'string' ? van.status : 'Actif';
        return vanStatus === statusFilter;
      });
    }

    return filtered.sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      let aVal: string = '', bVal: string = '';
      switch (sortField) {
        case 'model':
          aVal = typeof a.model === 'string' ? a.model : '';
          bVal = typeof b.model === 'string' ? b.model : '';
          return direction * aVal.localeCompare(bVal);
        case 'status':
          aVal = typeof a.status === 'string' ? a.status : 'Actif';
          bVal = typeof b.status === 'string' ? b.status : 'Actif';
          return direction * aVal.localeCompare(bVal);
        case 'license_plate':
        default:
          aVal = typeof a.license_plate === 'string' ? a.license_plate : '';
          bVal = typeof b.license_plate === 'string' ? b.license_plate : '';
          return direction * aVal.localeCompare(bVal);
      }
    });
  }, [vansToUse, searchTerm, statusFilter, sortField, sortDirection]);

  const handleAddVan = () => {
    setSelectedVan(null);
    setIsModalOpen(true);
  };

  const handleEditVan = (van: any) => {
    setSelectedVan(van);
    setIsModalOpen(true);
  };

  const handleQuickAction = (action: string, van: any) => {
    console.log(`Quick action: ${action} for van:`, van);
  };

  const handleDeleteVan = async (van: any) => {
    await deleteVan.mutateAsync(van.id);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedVan(null);
  };

  const handleModalSuccess = () => {
    refetch();
    handleModalClose();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Camionnettes</h1>
        <RefreshButton onRefresh={handleRefresh} />
      </div>
      
      <VanStats 
        vans={vansToUse}
        onAddVan={handleAddVan}
      />
      
      <VanFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        toggleSort={toggleSort}
      />

      <VanList
        vans={filteredAndSortedVans}
        totalVans={vansToUse.length}
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
