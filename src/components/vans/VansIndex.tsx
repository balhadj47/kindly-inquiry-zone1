
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { useVansIndexState } from '@/hooks/useVansIndexState';
import { useVansFiltering } from '@/hooks/useVansFiltering';
import VansIndexContent from './VansIndexContent';

const VansLoadingSkeleton = () => (
  <div className="h-screen flex flex-col overflow-hidden">
    <div className="flex-shrink-0 p-4 sm:p-6 border-b">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    </div>
    
    <div className="flex-shrink-0 p-4 sm:p-6 border-b">
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
    </div>

    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-64 w-full" />
        ))}
      </div>
    </div>
  </div>
);

interface VansIndexProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const VansIndex: React.FC<VansIndexProps> = ({ onRefresh, isRefreshing = false }) => {
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    vansData,
    isLoading,
    isError,
    refreshVans,
    isModalOpen,
    setIsModalOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedVan,
    isDeleting,
    handleAddVan,
    handleEditVan,
    handleDeleteVan,
    handleConfirmDelete,
    handleModalSuccess,
    handleQuickAction,
  } = useVansIndexState();

  const filteredAndSortedVans = useVansFiltering({
    vansData,
    searchTerm,
    statusFilter,
    sortField,
    sortDirection,
  });

  if (isLoading) {
    return <VansLoadingSkeleton />;
  }

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
    <VansIndexContent
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      sortField={sortField}
      setSortField={setSortField}
      sortDirection={sortDirection}
      setSortDirection={setSortDirection}
      vansData={vansData}
      filteredAndSortedVans={filteredAndSortedVans}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      isDeleteDialogOpen={isDeleteDialogOpen}
      setIsDeleteDialogOpen={setIsDeleteDialogOpen}
      selectedVan={selectedVan}
      isDeleting={isDeleting}
      handleAddVan={handleAddVan}
      handleEditVan={handleEditVan}
      handleDeleteVan={handleDeleteVan}
      handleConfirmDelete={handleConfirmDelete}
      handleModalSuccess={handleModalSuccess}
      handleQuickAction={handleQuickAction}
      onRefresh={onRefresh}
      isRefreshing={isRefreshing}
    />
  );
};

export default VansIndex;
