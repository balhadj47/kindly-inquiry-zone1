
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MissionsFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  companyFilter: string;
  setCompanyFilter: (filter: string) => void;
  vanFilter: string;
  setVanFilter: (filter: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  companies: any[];
  vans: any[];
  onClearFilters: () => void;
}

const MissionsFilters: React.FC<MissionsFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  companyFilter,
  setCompanyFilter,
  vanFilter,
  setVanFilter,
  statusFilter,
  setStatusFilter,
  companies,
  vans,
  onClearFilters
}) => {
  const isMobile = useIsMobile();
  
  const hasActiveFilters = searchTerm || companyFilter !== 'all' || vanFilter !== 'all' || statusFilter !== 'all';

  return (
    <Card className="shadow-sm border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-900`}>
              Filtres
            </h3>
          </div>
          
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="text-gray-600 border-gray-300 hover:bg-gray-50"
            >
              <X className="w-4 h-4 mr-2" />
              Effacer
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Company Filter */}
          <Select value={companyFilter} onValueChange={setCompanyFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Toutes les entreprises" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les entreprises</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.name}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Van Filter */}
          <Select value={vanFilter} onValueChange={setVanFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les véhicules" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les véhicules</SelectItem>
              {vans.map((van) => (
                <SelectItem key={van.id} value={van.id}>
                  {(van as any).reference_code || van.license_plate || van.model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="active">En cours</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default MissionsFilters;
