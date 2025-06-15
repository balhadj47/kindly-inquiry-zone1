
import React, { useState, useMemo } from 'react';
import { useVans } from '@/hooks/useVans';
import VanStats from './VanStats';
import VanFilters from './VanFilters';
import VanList from './VanList';
import VanModal from './VanModal';

const Vans = () => {
  const { vans, refetch } = useVans();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('license_plate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVan, setSelectedVan] = useState(null);

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedVans = useMemo(() => {
    let filtered = vans.filter(van => {
      const licensePlate = van.license_plate ?? '';
      const model = van.model ?? '';
      return (
        licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    if (statusFilter !== 'all') {
      filtered = filtered.filter(van => {
        const vanStatus = van.status || 'Actif';
        return vanStatus === statusFilter;
      });
    }

    return filtered.sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      switch (sortField) {
        case 'model':
          return direction * (a.model ?? '').localeCompare(b.model ?? '');
        case 'status':
          return direction * ((a.status || 'Actif').localeCompare(b.status || 'Actif'));
        case 'license_plate':
        default:
          return direction * (a.license_plate ?? '').localeCompare(b.license_plate ?? '');
      }
    });
  }, [vans, searchTerm, statusFilter, sortField, sortDirection]);

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

  const handleDeleteVan = (van: any) => {
    console.log('Delete van:', van);
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
      <VanStats 
        vans={vans}
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
        totalVans={vans.length}
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

export default Vans;
