
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import VansSearch from './VansSearch';
import VanFilters from './VanFilters';

interface VansFiltersSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  sortField: string;
  setSortField: (field: string) => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (direction: 'asc' | 'desc') => void;
}

const VansFiltersSection: React.FC<VansFiltersSectionProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection
}) => {
  return (
    <div className="flex-shrink-0 p-4 sm:p-6 border-b">
      <div className="space-y-4">
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
    </div>
  );
};

export default VansFiltersSection;
