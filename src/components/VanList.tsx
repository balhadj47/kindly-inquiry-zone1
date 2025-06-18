
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Van } from '@/types/van';
import { useVansPagination } from '@/hooks/useVansPagination';
import VanListGrid from './vans/VanListGrid';
import VanListSummary from './vans/VanListSummary';
import VanListPagination from './vans/VanListPagination';
import VanListEmptyState from './vans/VanListEmptyState';

interface VanListProps {
  vans: any[];
  totalVans: number;
  searchTerm: string;
  statusFilter: string;
  onAddVan: () => void;
  onEditVan: (van: any) => void;
  onQuickAction: (action: string, van: any) => void;
  onDeleteVan: (van: any) => void;
}

const VanList = React.memo(({ 
  vans, 
  totalVans, 
  searchTerm, 
  statusFilter, 
  onAddVan, 
  onEditVan, 
  onQuickAction,
  onDeleteVan
}: VanListProps) => {
  const navigate = useNavigate();
  const [filteredVans, setFilteredVans] = useState(vans);
  
  const {
    currentPage,
    totalPages,
    paginatedVans,
    handlePageChange,
  } = useVansPagination({
    filteredVans,
    itemsPerPage: 10,
    searchTerm,
    statusFilter,
  });

  useEffect(() => {
    const filtered = vans.filter((van) => {
      if (searchTerm) {
        return van.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               van.license_plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               van.model?.toLowerCase().includes(searchTerm.toLowerCase());
      }
      if (statusFilter !== 'all') {
        return van.status === statusFilter;
      }
      return true;
    });
    setFilteredVans(filtered);
  }, [vans, searchTerm, statusFilter]);

  const handleVanClick = (van: Van) => {
    navigate(`/vans/${van.id}`);
  };

  if (vans.length === 0) {
    return (
      <VanListEmptyState
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onAddVan={onAddVan}
      />
    );
  }

  return (
    <div className="space-y-6">
      <VanListSummary
        displayedCount={paginatedVans.length}
        filteredCount={filteredVans.length}
        currentPage={currentPage}
        totalPages={totalPages}
      />
      
      <VanListGrid
        vans={paginatedVans}
        onEditVan={onEditVan}
        onQuickAction={handleVanClick}
        onDeleteVan={onDeleteVan}
      />

      <VanListPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
});

VanList.displayName = 'VanList';

export default VanList;
