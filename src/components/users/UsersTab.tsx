
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

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.licenseNumber && user.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesGroup = groupFilter === 'all' || user.groupId === groupFilter;

    return matchesSearch && matchesStatus && matchesRole && matchesGroup;
  });

  const uniqueStatuses = [...new Set(users.map(user => user.status))];
  const uniqueRoles = [...new Set(users.map(user => user.role))];

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, roleFilter, groupFilter, view]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

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
            groups={groups}
            filteredCount={filteredUsers.length}
            totalCount={users.length}
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
