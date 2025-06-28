
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { Trip } from '@/contexts/TripContext';

interface MissionsFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  clearFilters: () => void;
  missions: Trip[];
}

const MissionsFilters: React.FC<MissionsFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  clearFilters,
  missions,
}) => {
  const filteredMissions = missions.filter(mission => {
    const matchesSearch = !searchTerm || 
      mission.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.van.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && mission.status === 'active') ||
      (statusFilter === 'completed' && mission.status === 'completed') ||
      (statusFilter === 'terminated' && mission.status === 'terminated');
    
    return matchesSearch && matchesStatus;
  });

  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'all';

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par entreprise, chauffeur, véhicule..."
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
            <SelectItem value="active">Actives</SelectItem>
            <SelectItem value="completed">Terminées</SelectItem>
            <SelectItem value="terminated">Annulées</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Effacer
          </Button>
        )}
      </div>

      <div className="text-sm text-gray-600">
        {filteredMissions.length} mission{filteredMissions.length !== 1 ? 's' : ''} 
        {hasActiveFilters ? ' correspond(ent) aux filtres' : ' au total'}
      </div>
    </div>
  );
};

export default MissionsFilters;
