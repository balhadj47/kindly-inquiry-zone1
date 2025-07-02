
import React from 'react';
import VansHeader from './VansHeader';
import VansSearch from './VansSearch';
import VanFilters from './VanFilters';
import VansEmptyState from './VansEmptyState';
import VanList from '../VanList';
import VanModal from '../VanModal';
import VanDeleteDialog from './VanDeleteDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Van } from '@/types/van';

interface VansIndexContentProps {
  // Search and filter props
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  sortField: string;
  setSortField: (field: string) => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (direction: 'asc' | 'desc') => void;
  
  // Data props
  vansData: Van[];
  filteredAndSortedVans: Van[];
  
  // Modal and action props
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  selectedVan: any;
  isDeleting: boolean;
  handleAddVan: () => void;
  handleEditVan: (van: any) => void;
  handleDeleteVan: (van: any) => void;
  handleConfirmDelete: () => Promise<void>;
  handleModalSuccess: () => void;
  handleQuickAction: (van: any) => void;
  
  // Refresh props
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const VansIndexContent: React.FC<VansIndexContentProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  vansData,
  filteredAndSortedVans,
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
  onRefresh,
  isRefreshing,
}) => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-4 sm:p-6 border-b bg-white">
        <VansHeader 
          onAddVan={handleAddVan} 
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
        />
      </div>
      
      {/* Fixed Search/Filter Section */}
      <div className="flex-shrink-0 p-4 sm:px-6 bg-white border-b">
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
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
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
      </div>

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

export default VansIndexContent;
