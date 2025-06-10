
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, Shield, Users as UsersIcon, X } from 'lucide-react';

interface UserFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  groupFilter: string;
  setGroupFilter: (group: string) => void;
  uniqueStatuses: string[];
  uniqueRoles: string[];
  groups: any[];
  filteredCount: number;
  totalCount: number;
  hasActiveFilters: boolean;
  clearFilters: () => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  roleFilter,
  setRoleFilter,
  groupFilter,
  setGroupFilter,
  uniqueStatuses,
  uniqueRoles,
  groups,
  filteredCount,
  totalCount,
  hasActiveFilters,
  clearFilters,
}) => {
  // Add null checks and default values
  const safeUniqueStatuses = uniqueStatuses || [];
  const safeUniqueRoles = uniqueRoles || [];
  const safeGroups = groups || [];
  const safeFilteredCount = filteredCount || 0;
  const safeTotalCount = totalCount || 0;

  console.log('UserFilters - Rendering with:', {
    searchTerm,
    statusFilter,
    roleFilter,
    groupFilter,
    uniqueStatuses: safeUniqueStatuses.length,
    uniqueRoles: safeUniqueRoles.length,
    groups: safeGroups.length
  });

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par nom, email, ou numéro de permis..."
              value={searchTerm || ''}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                <SelectItem value="all">Tous les Statuts</SelectItem>
                {safeUniqueStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <Shield className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                <SelectItem value="all">Tous les Rôles</SelectItem>
                {safeUniqueRoles.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={groupFilter} onValueChange={setGroupFilter}>
              <SelectTrigger>
                <UsersIcon className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrer par groupe" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                <SelectItem value="all">Tous les Groupes</SelectItem>
                {safeGroups.map(group => (
                  <SelectItem key={group.id} value={group.id}>{group.name || 'Groupe sans nom'}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="flex items-center space-x-2">
                <X className="h-4 w-4" />
                <span>Effacer les Filtres</span>
              </Button>
            )}
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Affichage de {safeFilteredCount} sur {safeTotalCount} utilisateurs
              {hasActiveFilters && ` (filtré)`}
            </span>
            {hasActiveFilters && (
              <div className="flex items-center space-x-2">
                <span>Filtres actifs:</span>
                {searchTerm && <Badge variant="secondary">Recherche: "{searchTerm}"</Badge>}
                {statusFilter !== 'all' && <Badge variant="secondary">Statut: {statusFilter}</Badge>}
                {roleFilter !== 'all' && <Badge variant="secondary">Rôle: {roleFilter}</Badge>}
                {groupFilter !== 'all' && (
                  <Badge variant="secondary">
                    Groupe: {safeGroups.find(g => g.id === groupFilter)?.name || 'Inconnu'}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserFilters;
