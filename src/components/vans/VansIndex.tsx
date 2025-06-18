
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

const VansIndex = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('license_plate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const { vans, refetch } = useVans();
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

  const filteredAndSortedVans = useMemo(() => {
    let filtered = vans.filter(van => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        van.license_plate?.toLowerCase().includes(searchLower) ||
        van.model?.toLowerCase().includes(searchLower) ||
        van.reference_code?.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus = statusFilter === 'all' || van.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

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

  return (
    <div className="space-y-4 sm:space-y-6">
      <VansHeader onAddVan={handleAddVan} />
      
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
