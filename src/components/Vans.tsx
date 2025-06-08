
import React, { useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useVans } from '@/hooks/useVans';
import { transformVanData } from '@/utils/vanUtils';
import VanModal from './VanModal';
import VanStats from './VanStats';
import VanFilters from './VanFilters';
import VanList from './VanList';

const Vans = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVan, setSelectedVan] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('license_plate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();
  const { vans, loading, error } = useVans();

  // Transform database vans to display format
  const displayVans = transformVanData(vans);

  const filteredAndSortedVans = useMemo(() => {
    let filtered = displayVans.filter(van => {
      const matchesSearch = 
        van.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        van.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (van.carNumberPlate && van.carNumberPlate.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (van.driver && van.driver.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || van.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort vans
    filtered.sort((a, b) => {
      let aValue = a[sortField] || '';
      let bValue = b[sortField] || '';
      
      if (sortField === 'totalTrips' || sortField === 'fuelLevel' || sortField === 'efficiency') {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [displayVans, searchTerm, statusFilter, sortField, sortDirection]);

  const handleAddVan = () => {
    setSelectedVan(null);
    setIsModalOpen(true);
  };

  const handleEditVan = (van: any) => {
    setSelectedVan(van);
    setIsModalOpen(true);
  };

  const handleQuickAction = (action: string, van: any) => {
    toast({
      title: "Action Effectuée",
      description: `Action ${action} effectuée sur ${van.license_plate}`,
    });
  };

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des camionnettes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Erreur: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <VanStats vans={displayVans} onAddVan={handleAddVan} />
      
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
        totalVans={displayVans.length}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onAddVan={handleAddVan}
        onEditVan={handleEditVan}
        onQuickAction={handleQuickAction}
      />

      <VanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        van={selectedVan}
      />
    </div>
  );
};

export default Vans;
