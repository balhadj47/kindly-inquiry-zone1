
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X, Plus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MissionsFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  companyFilter: string;
  setCompanyFilter: (company: string) => void;
  vanFilter: string;
  setVanFilter: (van: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  companies: any[];
  vans: any[];
  onClearFilters: () => void;
  onNewMissionClick: () => void;
  canCreateMissions: boolean;
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
  onClearFilters,
  onNewMissionClick,
  canCreateMissions
}) => {
  const isMobile = useIsMobile();

  const hasActiveFilters = searchTerm || companyFilter !== 'all' || vanFilter !== 'all' || statusFilter !== 'all';

  return (
    <Card className="shadow-sm border-gray-200">
      <CardContent className="p-4 sm:p-6">
        <div className={`flex items-center justify-between mb-4 ${isMobile ? 'flex-col space-y-4' : ''}`}>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Filtres</h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4 mr-1" />
                Effacer
              </Button>
            )}
          </div>
          
          {canCreateMissions && (
            <Button
              onClick={onNewMissionClick}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Mission
            </Button>
          )}
        </div>

        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par entreprise, chauffeur..."
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
              <SelectItem value="active">En Mission</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default MissionsFilters;
