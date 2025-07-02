
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X, SortAsc, SortDesc } from 'lucide-react';
import { Van } from '@/types/van';

interface VansFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  sortField: string;
  setSortField: (field: string) => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (direction: 'asc' | 'desc') => void;
  clearFilters: () => void;
  vans: Van[];
}

const VansFilters: React.FC<VansFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  clearFilters,
  vans = [],
}) => {
  const filteredVans = vans.filter(van => {
    const matchesSearch = !searchTerm || 
      van.license_plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      van.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      van.reference_code?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || van.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const uniqueStatuses = Array.from(new Set(vans.map(van => van.status).filter(Boolean)));
  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'all';

  const sortOptions = [
    { value: 'license_plate', label: 'Plaque d\'immatriculation' },
    { value: 'model', label: 'Modèle' },
    { value: 'reference_code', label: 'Code de référence' },
    { value: 'created_at', label: 'Date d\'ajout' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par plaque, modèle, référence..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {uniqueStatuses.map(status => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Select value={sortField} onValueChange={setSortField}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
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

        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Effacer
          </Button>
        )}
      </div>

      <div className="text-sm text-gray-600">
        {filteredVans.length} véhicule{filteredVans.length !== 1 ? 's' : ''} 
        {hasActiveFilters ? ' correspond(ent) aux filtres' : ' au total'}
      </div>
    </div>
  );
};

export default VansFilters;
