
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SortAsc, SortDesc, Filter } from 'lucide-react';

interface VanFiltersProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  sortField: string;
  setSortField: (field: string) => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (direction: 'asc' | 'desc') => void;
}

const VanFilters = ({
  statusFilter,
  setStatusFilter,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection
}: VanFiltersProps) => {
  const statusOptions = [
    { value: 'all', label: 'Tous les Statuts' },
    { value: 'Actif', label: 'Actif' },
    { value: 'En Transit', label: 'En Transit' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Inactif', label: 'Inactif' },
  ];

  const sortOptions = [
    { value: 'license_plate', label: 'Plaque d\'immatriculation' },
    { value: 'model', label: 'Modèle' },
    { value: 'reference_code', label: 'Code de référence' },
    { value: 'insurer', label: 'Assureur' },
    { value: 'created_at', label: 'Date d\'ajout' },
  ];

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col sm:flex-row gap-2 flex-1">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortField} onValueChange={setSortField}>
              <SelectTrigger className="w-full sm:w-[200px]">
                {sortDirection === 'asc' ? 
                  <SortAsc className="h-4 w-4 mr-2" /> : 
                  <SortDesc className="h-4 w-4 mr-2" />
                }
                <SelectValue placeholder="Trier par..." />
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
              onClick={toggleSortDirection}
              className="px-3"
            >
              {sortDirection === 'asc' ? 
                <SortAsc className="h-4 w-4" /> : 
                <SortDesc className="h-4 w-4" />
              }
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VanFilters;
