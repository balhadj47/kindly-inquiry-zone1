
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { User } from '@/types/rbac';
import UserFilters from './UserFilters';
import UserGrid from './UserGrid';

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
}) => {
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

  return (
    <TabsContent value="users" className="space-y-4">
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

      <UserGrid
        users={filteredUsers}
        hasActiveFilters={hasActiveFilters}
        clearFilters={clearFilters}
        onEditUser={onEditUser}
        onDeleteUser={onDeleteUser}
      />
    </TabsContent>
  );
};

export default UsersTab;
