import React, { useState, useMemo } from 'react';
import VansHeader from './VansHeader';
import VansSearch from './VansSearch';
import VanFilters from './VanFilters';
import VansEmptyState from './VansEmptyState';
import VanList from '../VanList';
import VanModal from '../VanModal';
import VanDeleteDialog from './VanDeleteDialog';
import { useVans } from '@/hooks/useVans';
import { useVanDelete } from '@/hooks/useVanDelete';
import { useVansState } from '@/hooks/useVansState';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';
import { useSmartContentUpdate } from '@/hooks/useSmartContentUpdate';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const VansLoadingSkeleton = () => (
  <div className="space-y-4 sm:space-y-6">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-6 w-32" />
      </div>
      <Skeleton className="h-12 w-12 mt-4 lg:mt-0" />
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
  
  const { vans, refetch, isLoading } = useVans();
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

  // Smart content update tracking
  const { hasChanges, updatedItems, newItems } = useSmartContentUpdate(vans, 'id');

  // Real-time data updates
  const { forceUpdate, isEnabled: isRealTimeEnabled } = useRealTimeUpdates({
    onUpdate: async () => {
      // Clear global cache first for fresh data
      if (typeof window !== 'undefined') {
        (window as any).globalVansCache = null;
        (window as any).globalFetchPromise = null;
      }
      await refetch();
    },
    interval: 30000, // Update every 30 seconds
    enabled: true
  });

  // Force refresh with cache clearing
  const handleRefresh = async () => {
    console.log('🔄 VansIndex: Force refresh triggered');
    await forceUpdate();
  };

  // Log content changes
  React.useEffect(() => {
    if (hasChanges) {
      console.log('📊 Content changes detected:', {
        updated: updatedItems.length,
        new: newItems.length
      });
    }
  }, [hasChanges, updatedItems.length, newItems.length]);

  const filteredAndSortedVans = useMemo(() => {
    console.log('Filtering vans:', { vans: vans.length, statusFilter, searchTerm });
    
    let filtered = vans.filter(van => {
      // Search filter
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
        matchesSearch 
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
  }, [vans, searchTerm, statusFilter, sortField, sortDirection]);

  const handleModalSuccess = () => {
    refetch();
  };

  const handleQuickAction = (van: any) => {
    console.log('Quick action for van:', van);
  };

  // Show loading skeleton while data is loading
  if (isLoading) {
    return <VansLoadingSkeleton />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <VansHeader onAddVan={handleAddVan} onRefresh={handleRefresh} />
      
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
          
          {/* Real-time status indicator */}
          <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className={`w-2 h-2 rounded-full ${isRealTimeEnabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span>{isRealTimeEnabled ? 'Mises à jour automatiques activées' : 'Mises à jour automatiques désactivées'}</span>
            </div>
            {hasChanges && (
              <div className="text-sm text-blue-600 font-medium">
                Nouvelles données détectées
              </div>
            )}
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
          totalVans={vans.length}
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
