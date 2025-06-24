
import React, { useState, useMemo, useEffect } from 'react';
import VansHeader from './VansHeader';
import VansSearch from './VansSearch';
import VanFilters from './VanFilters';
import VansEmptyState from './VansEmptyState';
import VanList from '../VanList';
import VanModal from '../VanModal';
import VanDeleteDialog from './VanDeleteDialog';
import { useAllVans, useVanMutations } from '@/hooks/useVansOptimized';
import { useVansState } from '@/hooks/useVansState';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Van } from '@/types/van';

const VansLoadingSkeleton = () => (
  <div className="space-y-4 sm:space-y-6">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-6 w-32" />
      </div>
    </div>
    
    <Card>
      <CardContent className="p-4 sm:pt-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <div className="flex flex-col sm:flex-row gap-2 lg:flex-shrink-0">
            <Skeleton className="h-10 w-full sm:w-[180px]" />
            <Skeleton className="h-10 w-full sm:w-[200px]" />
            <Skeleton className="h-10 w-12" />
          </div>
        </div>
      </CardContent>
    </Card>

    <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-64 w-full" />
      ))}
    </div>
  </div>
);

const VansIndex = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('license_plate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Get vans data with caching enabled
  const { data: vansData = [], refetch, isLoading, isError } = useAllVans();
  const { invalidateVans, refreshVans } = useVanMutations();

  const setVans = () => {
    refreshVans();
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

  const filteredAndSortedVans = useMemo(() => {
    console.log('Filtering vans:', { vans: vansData?.length || 0, statusFilter, searchTerm });
    
    if (!vansData || vansData.length === 0) {
      return [];
    }
    
    let filtered = vansData.filter(van => {
      // Search filter - now includes reference_code
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        van.license_plate?.toLowerCase().includes(searchLower) ||
        van.model?.toLowerCase().includes(searchLower) ||
        van.reference_code?.toLowerCase().includes(searchLower);

      // Status filter - make sure we're comparing the exact values
      const matchesStatus = statusFilter === 'all' || van.status === statusFilter;
      
      console.log('Van filter check:', { 
        vanId: van.id, 
        vanStatus: van.status, 
        statusFilter, 
        matchesStatus, 
        matchesSearch,
        vanReferenceCode: van.reference_code
      });

      return matchesSearch && matchesStatus;
    });

    console.log('Filtered vans:', filtered.length);

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue = '';
      let bValue = '';

      switch (sortField) {
        case 'license_plate':
          aValue = a.license_plate || '';
          bValue = b.license_plate || '';
          break;
        case 'model':
          aValue = a.model || '';
          bValue = b.model || '';
          break;
        case 'reference_code':
          aValue = a.reference_code || '';
          bValue = b.reference_code || '';
          break;
        case 'insurer':
          aValue = a.insurer || '';
          bValue = b.insurer || '';
          break;
        case 'created_at':
          aValue = a.created_at || '';
          bValue = b.created_at || '';
          break;
        default:
          aValue = a.license_plate || '';
          bValue = b.license_plate || '';
      }

      if (sortField === 'created_at') {
        // For dates, convert to Date objects for proper comparison
        const dateA = new Date(aValue);
        const dateB = new Date(bValue);
        return sortDirection === 'asc' 
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      } else {
        // For strings, use localeCompare
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      }
    });

    return filtered;
  }, [vansData, searchTerm, statusFilter, sortField, sortDirection]);

  const handleModalSuccess = () => {
    refreshVans();
  };

  const handleQuickAction = (van: any) => {
    console.log('Quick action for van:', van);
  };

  // Show loading only when actually loading
  if (isLoading) {
    return <VansLoadingSkeleton />;
  }

  // Show error state
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-4">Impossible de charger les camionnettes</p>
          <button 
            onClick={() => refreshVans()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <VansHeader onAddVan={handleAddVan} />
      
      <Card>
        <CardContent className="p-4 sm:pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <VansSearch 
              searchTerm={searchTerm} 
              onSearchChange={setSearchTerm} 
            />
            <VanFilters
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              sortField={sortField}
              setSortField={setSortField}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
            />
          </div>
        </CardContent>
      </Card>

      {filteredAndSortedVans.length === 0 ? (
        <VansEmptyState 
          searchTerm={searchTerm} 
          onAddVan={handleAddVan} 
        />
      ) : (
        <VanList
          vans={filteredAndSortedVans}
          totalVans={vansData?.length || 0}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onAddVan={handleAddVan}
          onEditVan={handleEditVan}
          onQuickAction={handleQuickAction}
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
