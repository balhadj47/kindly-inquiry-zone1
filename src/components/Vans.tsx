
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

  // Safeguard filter and string conversion against undefined/null/bad data
  const filteredAndSortedVans = useMemo(() => {
    let filtered = vans.filter(van => {
      if (!van || typeof van !== 'object') return false;
      // Ensure string comparison even if property is null or not string
      const licensePlateStr = typeof van.license_plate === 'string' ? van.license_plate : (van.license_plate ? String(van.license_plate) : '');
      const modelStr = typeof van.model === 'string' ? van.model : (van.model ? String(van.model) : '');
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
