
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';

interface VanFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  sortField: string;
  setSortField: (field: string) => void;
  sortDirection: 'asc' | 'desc';
  toggleSort: (field: string) => void;
}

const VanFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  sortField,
  setSortField,
  sortDirection,
  toggleSort
}: VanFiltersProps) => {
  const statusOptions = [
    { value: 'all', label: 'Tous les Statuts' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'En Transit', label: 'En Transit' },
    { value: 'Maintenance', label: 'Maintenance' },
  ];

  return (
    <Card className="border-gray-200">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par plaque, modèle, chauffeur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-white border-gray-200">
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
              <SelectTrigger className="w-full sm:w-[180px] bg-white border-gray-200">
                {sortDirection === 'asc' ? 
                  <SortAsc className="h-4 w-4 mr-2" /> : 
                  <SortDesc className="h-4 w-4 mr-2" />
                }
                <SelectValue placeholder="Trier par..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="license_plate">Plaque d'Immatriculation</SelectItem>
                <SelectItem value="model">Modèle</SelectItem>
                <SelectItem value="totalTrips">Voyages Totaux</SelectItem>
                <SelectItem value="fuelLevel">Niveau de Carburant</SelectItem>
                <SelectItem value="efficiency">Efficacité</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => toggleSort(sortField)}
              className="px-3 border-gray-200 hover:bg-gray-50"
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
