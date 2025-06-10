
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
  // Add comprehensive safety checks and default values
  const safeUniqueStatuses = Array.isArray(uniqueStatuses) ? uniqueStatuses.filter(Boolean) : [];
  const safeUniqueRoles = Array.isArray(uniqueRoles) ? uniqueRoles.filter(Boolean) : [];
  const safeGroups = Array.isArray(groups) ? groups.filter(group => group && group.id && group.name) : [];
  const safeFilteredCount = typeof filteredCount === 'number' && !isNaN(filteredCount) ? filteredCount : 0;
  const safeTotalCount = typeof totalCount === 'number' && !isNaN(totalCount) ? totalCount : 0;
  const safeSearchTerm = typeof searchTerm === 'string' ? searchTerm : '';

  // Safe handlers with error catching
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setSearchTerm(e.target.value || '');
    } catch (error) {
      console.error('Error updating search term:', error);
    }
  };

  const handleStatusChange = (value: string) => {
    try {
      setStatusFilter(value || 'all');
    } catch (error) {
      console.error('Error updating status filter:', error);
    }
  };

  const handleRoleChange = (value: string) => {
    try {
      setRoleFilter(value || 'all');
    } catch (error) {
      console.error('Error updating role filter:', error);
    }
  };

  const handleGroupChange = (value: string) => {
    try {
      setGroupFilter(value || 'all');
    } catch (error) {
      console.error('Error updating group filter:', error);
    }
  };

  const handleClearFilters = () => {
    try {
      clearFilters();
    } catch (error) {
      console.error('Error clearing filters:', error);
    }
  };

  // Find group name safely
  const getGroupName = (groupId: string) => {
    const group = safeGroups.find(g => g.id === groupId);
    return group?.name || 'Groupe inconnu';
  };

  console.log('UserFilters - Rendering with safe data:', {
    searchTerm: safeSearchTerm,
    statusFilter,
    roleFilter,
    groupFilter,
    uniqueStatuses: safeUniqueStatuses.length,
    uniqueRoles: safeUniqueRoles.length,
    groups: safeGroups.length,
    filteredCount: safeFilteredCount,
    totalCount: safeTotalCount
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
              value={safeSearchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={statusFilter || 'all'} onValueChange={handleStatusChange}>
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

            <Select value={roleFilter || 'all'} onValueChange={handleRoleChange}>
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

            <Select value={groupFilter || 'all'} onValueChange={handleGroupChange}>
              <SelectTrigger>
                <UsersIcon className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrer par groupe" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                <SelectItem value="all">Tous les Groupes</SelectItem>
                {safeGroups.map(group => (
                  <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="outline" onClick={handleClearFilters} className="flex items-center space-x-2">
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
                {safeSearchTerm && <Badge variant="secondary">Recherche: "{safeSearchTerm}"</Badge>}
                {statusFilter !== 'all' && <Badge variant="secondary">Statut: {statusFilter}</Badge>}
                {roleFilter !== 'all' && <Badge variant="secondary">Rôle: {roleFilter}</Badge>}
                {groupFilter !== 'all' && (
                  <Badge variant="secondary">
                    Groupe: {getGroupName(groupFilter)}
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
