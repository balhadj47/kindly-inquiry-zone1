
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X, Download } from 'lucide-react';
import { Van } from '@/types/van';

export interface TripHistoryFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  companyFilter: string;
  setCompanyFilter: (company: string) => void;
  vanFilter: string;
  setVanFilter: (van: string) => void;
  companies: any[];
  vans: Van[];
  onClearFilters: () => void;
  disabled?: boolean;
}

const TripHistoryFilters: React.FC<TripHistoryFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  companyFilter,
  setCompanyFilter,
  vanFilter,
  setVanFilter,
  companies,
  vans,
  onClearFilters,
  disabled = false
}) => {
  const hasActiveFilters = searchTerm || companyFilter !== 'all' || vanFilter !== 'all';

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher par entreprise, succursale, véhicule ou conducteur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            disabled={disabled}
          />
        </div>

        {/* Company Filter */}
        <Select value={companyFilter} onValueChange={setCompanyFilter} disabled={disabled}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Toutes les entreprises" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les entreprises</SelectItem>
            {companies.map((company) => (
              <SelectItem key={company.id || company.name} value={company.name}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Van Filter */}
        <Select value={vanFilter} onValueChange={setVanFilter} disabled={disabled}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Tous les véhicules" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les véhicules</SelectItem>
            {vans.map((van) => (
              <SelectItem key={van.id} value={van.id}>
                {van.license_plate ? `${van.license_plate} - ${van.model}` : van.model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Export Button */}
        <Button
          variant="outline"
          className="flex items-center gap-2 px-4"
          disabled={disabled}
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Exporter</span>
        </Button>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="flex items-center gap-2 px-3"
            disabled={disabled}
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Effacer</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default TripHistoryFilters;
