
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
  const [sortBy, setSortBy] = useState('license_plate');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVan, setSelectedVan] = useState(null);

  const filteredAndSortedVans = useMemo(() => {
    let filtered = vans.filter(van =>
      van.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      van.model.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== 'all') {
      filtered = filtered.filter(van => {
        const vanStatus = van.status || 'Actif';
        return vanStatus === statusFilter;
      });
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'model':
          return a.model.localeCompare(b.model);
        case 'status':
          return (a.status || 'Actif').localeCompare(b.status || 'Actif');
        case 'license_plate':
        default:
          return a.license_plate.localeCompare(b.license_plate);
      }
    });
  }, [vans, searchTerm, statusFilter, sortBy]);

  const handleAddVan = () => {
    setSelectedVan(null);
    setIsModalOpen(true);
  };

  const handleEditVan = (van: any) => {
    setSelectedVan(van);
    setIsModalOpen(true);
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
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <VanList
        vans={filteredAndSortedVans}
        onEditVan={handleEditVan}
      />

      <VanModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        van={selectedVan}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default Vans;
