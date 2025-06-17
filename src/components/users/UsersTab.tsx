
import React, { useState, useMemo, useCallback } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { User } from '@/types/rbac';
import UserFilters from './UserFilters';
import UserGrid from './UserGrid';
import UserTable from './UserTable';
import UserViewToggle from './UserViewToggle';
import UserPagination from './UserPagination';
import { useIsMobile } from '@/hooks/use-mobile';

interface UsersTabProps {
  users: User[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onChangePassword: (user: User) => void;
}

const UsersTab: React.FC<UsersTabProps> = ({
  users,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  roleFilter,
  setRoleFilter,
  clearFilters,
  hasActiveFilters,
  onEditUser,
  onDeleteUser,
  onChangePassword,
}) => {
  const isMobile = useIsMobile();
  const [view, setView] = useState<'grid' | 'table'>(isMobile ? 'grid' : 'table');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = view === 'grid' ? (isMobile ? 6 : 12) : (isMobile ? 10 : 25);

  // Add comprehensive safety checks for arrays
  const safeUsers = useMemo(() => {
    if (!Array.isArray(users)) {
      console.warn('UsersTab - users prop is not an array:', typeof users);
      return [];
    }
    return users.filter(user => user && typeof user === 'object' && user.id);
  }, [users]);

  // Memoize filtered users to prevent unnecessary recalculations
  const filteredUsers = useMemo(() => {
    try {
      return safeUsers.filter(user => {
        if (!user || typeof user !== 'object') {
          console.warn('UsersTab - Invalid user object:', user);
          return false;
        }

        const safeSearchTerm = typeof searchTerm === 'string' ? searchTerm.toLowerCase() : '';
        
        const matchesSearch = !safeSearchTerm || 
          (user.name && user.name.toLowerCase().includes(safeSearchTerm)) ||
          (user.email && user.email.toLowerCase().includes(safeSearchTerm)) ||
          (user.licenseNumber && user.licenseNumber.toLowerCase().includes(safeSearchTerm));

        const matchesStatus = !statusFilter || statusFilter === 'all' || user.status === statusFilter;
        const matchesRole = !roleFilter || roleFilter === 'all' || user.systemGroup === roleFilter;

        return matchesSearch && matchesStatus && matchesRole;
      });
    } catch (error) {
      console.error('Error filtering users:', error);
      return [];
    }
  }, [safeUsers, searchTerm, statusFilter, roleFilter]);

  // Memoize unique values
  const uniqueStatuses = useMemo(() => {
    try {
      const statuses = safeUsers
        .map(user => user?.status)
        .filter(status => status && typeof status === 'string');
      return [...new Set(statuses)];
    } catch (error) {
      console.error('Error calculating unique statuses:', error);
      return [];
    }
  }, [safeUsers]);

  const uniqueRoles = useMemo(() => {
    try {
      const roles = safeUsers
        .map(user => user?.systemGroup)
        .filter(role => role && typeof role === 'string');
      return [...new Set(roles)];
    } catch (error) {
      console.error('Error calculating unique roles:', error);
      return [];
    }
  }, [safeUsers]);

  // Safe view change handler
  const handleViewChange = useCallback((newView: 'grid' | 'table') => {
    try {
      setView(newView);
      setCurrentPage(1); // Reset to first page when changing view
    } catch (error) {
      console.error('Error changing view:', error);
    }
  }, []);

  // Safe page change handler
  const handlePageChange = useCallback((page: number) => {
    try {
      const safePage = Math.max(1, Math.floor(page));
      setCurrentPage(safePage);
    } catch (error) {
      console.error('Error changing page:', error);
    }
  }, []);

  // Reset to first page when filters change
  React.useEffect(() => {
    console.log('UsersTab - Resetting to page 1 due to filter change');
    setCurrentPage(1);
  }, [searchTerm, statusFilter, roleFilter, view]);

  // Calculate pagination safely
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  console.log('UsersTab - Rendering with safe data:', {
    usersCount: safeUsers.length,
    searchTerm,
    statusFilter,
    roleFilter,
    view,
    currentPage: safeCurrentPage,
    filteredUsersCount: filteredUsers.length,
    totalPages,
    paginatedUsersCount: paginatedUsers.length,
    isMobile
  });

  return (
    <TabsContent value="users" className="space-y-4">
      <div className="space-y-4">
        <UserFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          groupFilter="all"
          setGroupFilter={() => {}}
          uniqueStatuses={uniqueStatuses}
          uniqueRoles={uniqueRoles}
          groups={[]}
          filteredCount={filteredUsers.length}
          totalCount={safeUsers.length}
          hasActiveFilters={hasActiveFilters}
          clearFilters={clearFilters}
        />
        
        {!isMobile && (
          <div className="flex justify-end">
            <UserViewToggle
              view={view}
              onViewChange={handleViewChange}
            />
          </div>
        )}
      </div>

      {view === 'table' && !isMobile ? (
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
              <div className="overflow-x-auto">
                <UserTable
                  users={paginatedUsers}
                  onEditUser={onEditUser}
                  onDeleteUser={onDeleteUser}
                  onChangePassword={onChangePassword}
                />
              </div>
              
              <UserPagination
                currentPage={safeCurrentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
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
          currentPage={safeCurrentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}
    </TabsContent>
  );
};

export default UsersTab;
