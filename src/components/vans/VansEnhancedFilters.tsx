
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FilterBar } from '@/components/ui/filter-bar';
import { QuickFilterChips } from '@/components/ui/quick-filter-chips';
import { Button } from '@/components/ui/button';
import { SortAsc, SortDesc } from 'lucide-react';

interface VansEnhancedFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  sortField: string;
  setSortField: (field: string) => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (direction: 'asc' | 'desc') => void;
}

const VansEnhancedFilters: React.FC<VansEnhancedFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection
}) => {
  const statusOptions = [
    { value: 'Active', label: 'Active', count: 12 },
    { value: 'Inactive', label: 'Inactive', count: 3 },
    { value: 'Maintenance', label: 'Maintenance', count: 2 },
    { value: 'En Transit', label: 'En Transit', count: 8 },
  ];

  const sortOptions = [
    { value: 'license_plate', label: 'Plaque d\'immatriculation' },
    { value: 'model', label: 'Modèle' },
    { value: 'reference_code', label: 'Code de référence' },
    { value: 'created_at', label: 'Date d\'ajout' },
  ];

  const filters = [
    {
      key: 'status',
      label: 'Statut',
      value: statusFilter,
      options: statusOptions,
      onChange: setStatusFilter
    }
  ];

  const activeFilters = [
    ...(searchTerm ? [{ key: 'search', label: `"${searchTerm}"`, value: searchTerm }] : []),
    ...(statusFilter !== 'all' ? [{ key: 'status', label: `Statut: ${statusFilter}`, value: statusFilter }] : []),
  ];

  const handleRemoveFilter = (key: string) => {
    if (key === 'search') setSearchTerm('');
    if (key === 'status') setStatusFilter('all');
  };

  const handleClearAll = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardContent className="p-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Rechercher par plaque, modèle, référence..."
              filters={filters}
              activeFiltersCount={activeFilters.length}
              onClearFilters={handleClearAll}
            />
          </div>
          
          <div className="flex items-center gap-2 lg:flex-shrink-0">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="h-9 px-3 rounded-md border border-gray-200 bg-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              className="h-9 w-9 p-0"
            >
              {sortDirection === 'asc' ? 
                <SortAsc className="h-4 w-4" /> : 
                <SortDesc className="h-4 w-4" />
              }
            </Button>
          </div>
        </div>
        
        <QuickFilterChips
          activeFilters={activeFilters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAll}
        />
      </CardContent>
    </Card>
  );
};

export default VansEnhancedFilters;
