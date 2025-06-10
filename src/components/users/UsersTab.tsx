
import React, { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { User } from '@/types/rbac';
import UserFilters from './UserFilters';
import UserGrid from './UserGrid';
import UserTable from './UserTable';
import UserViewToggle from './UserViewToggle';
import UserPagination from './UserPagination';

interface UsersTabProps {
  users: User[];
  groups: any[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  groupFilter: string;
  setGroupFilter: (group: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onChangePassword: (user: User) => void;
}

const UsersTab: React.FC<UsersTabProps> = ({
  users,
  groups,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  roleFilter,
  setRoleFilter,
  groupFilter,
  setGroupFilter,
  clearFilters,
  hasActiveFilters,
  onEditUser,
  onDeleteUser,
  onChangePassword,
}) => {
  const [view, setView] = useState<'grid' | 'table'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = view === 'grid' ? 12 : 25;

  // Add safety checks for arrays
  const safeUsers = users || [];
  const safeGroups = groups || [];

  console.log('UsersTab - Rendering with:', {
    usersCount: safeUsers.length,
    groupsCount: safeGroups.length,
    searchTerm,
    statusFilter,
    roleFilter,
    groupFilter,
    view,
    currentPage
  });

  const filteredUsers = safeUsers.filter(user => {
    if (!user) {
      console.warn('UsersTab - Null user found in filter');
      return false;
    }

    const matchesSearch = 
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.licenseNumber && user.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesGroup = groupFilter === 'all' || user.groupId === groupFilter;

    return matchesSearch && matchesStatus && matchesRole && matchesGroup;
  });

  const uniqueStatuses = [...new Set(safeUsers.map(user => user?.status).filter(Boolean))];
  const uniqueRoles = [...new Set(safeUsers.map(user => user?.role).filter(Boolean))];

  console.log('UsersTab - Filter results:', {
    filteredUsersCount: filteredUsers.length,
    uniqueStatuses: uniqueStatuses.length,
    uniqueRoles: uniqueRoles.length
  });

  // Reset to first page when filters change
  React.useEffect(() => {
    console.log('UsersTab - Resetting to page 1 due to filter change');
    setCurrentPage(1);
  }, [searchTerm, statusFilter, roleFilter, groupFilter, view]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  console.log('UsersTab - Pagination:', {
    totalPages,
    currentPage,
    startIndex,
    endIndex,
    paginatedUsersCount: paginatedUsers.length
  });

  return (
    <TabsContent value="users" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <UserFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            groupFilter={groupFilter}
            setGroupFilter={setGroupFilter}
            uniqueStatuses={uniqueStatuses}
            uniqueRoles={uniqueRoles}
            groups={safeGroups}
            filteredCount={filteredUsers.length}
            totalCount={safeUsers.length}
            hasActiveFilters={hasActiveFilters}
            clearFilters={clearFilters}
          />
        </div>
        
        <UserViewToggle
          view={view}
          onViewChange={setView}
        />
      </div>

      {view === 'table' ? (
        <div className="space-y-4">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {hasActiveFilters 
                  ? 'Aucun utilisateur ne correspond aux filtres actuels.' 
                  : 'Aucun utilisateur trouvé.'
                }
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-primary hover:underline mt-2"
                >
                  Effacer les filtres
                </button>
              )}
            </div>
          ) : (
            <>
              <UserTable
                users={paginatedUsers}
                onEditUser={onEditUser}
                onDeleteUser={onDeleteUser}
                onChangePassword={onChangePassword}
              />
              
              <UserPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredUsers.length}
                itemsPerPage={itemsPerPage}
              />
            </>
          )}
        </div>
      ) : (
        <UserGrid
          users={filteredUsers}
          hasActiveFilters={hasActiveFilters}
          clearFilters={clearFilters}
          onEditUser={onEditUser}
          onDeleteUser={onDeleteUser}
          onChangePassword={onChangePassword}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </TabsContent>
  );
};

export default UsersTab;
