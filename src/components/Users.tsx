
import React, { useState } from 'react';
import { useRBAC } from '@/contexts/RBACContext';
import { useAuth } from '@/contexts/AuthContext';
import UsersHeader from './users/UsersHeader';
import UsersNavigation from './users/UsersNavigation';
import UsersTab from './users/UsersTab';
import GroupsTab from './users/GroupsTab';
import UsersModals from './users/UsersModals';
import { LoadingState, ErrorState } from './users/UsersStates';
import { useUserActionHandlers } from './users/UserActionHandlers';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  
  const { users, groups, hasPermission, loading, currentUser } = useRBAC();
  const { user: authUser } = useAuth();

  console.log('Users component render state:', {
    usersCount: users?.length || 0,
    groupsCount: groups?.length || 0,
    currentUser,
    authUser,
    loading
  });

  const {
    isUserModalOpen,
    setIsUserModalOpen,
    isGroupModalOpen,
    setIsGroupModalOpen,
    isPermissionsModalOpen,
    setIsPermissionsModalOpen,
    isPasswordModalOpen,
    setIsPasswordModalOpen,
    selectedUser,
    selectedGroup,
    handleAddUser,
    handleEditUser,
    handleChangePassword,
    handleDeleteUser,
    handleAddGroup,
    handleEditGroup,
    handleManagePermissions,
    handleDeleteGroup,
  } = useUserActionHandlers();

  // Debug permissions
  console.log('Users component - Permission checks:', {
    'users:read': hasPermission('users:read'),
    'users:create': hasPermission('users:create'),
    'groups:read': hasPermission('groups:read'),
  });

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setRoleFilter('all');
    setGroupFilter('all');
  };

  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'all' || roleFilter !== 'all' || groupFilter !== 'all';

  if (loading) {
    return <LoadingState />;
  }

  // Show message if user is not authenticated
  if (!authUser) {
    return (
      <ErrorState
        title="Authentification requise"
        message="Vous devez être connecté pour accéder à la gestion des utilisateurs."
      />
    );
  }

  // Show message if current user data is not found
  if (!currentUser) {
    return (
      <ErrorState
        title="Profil utilisateur introuvable"
        message="Votre profil utilisateur n'a pas été trouvé dans le système. Veuillez contacter un administrateur."
      />
    );
  }

  // Check if user has permission to view users
  if (!hasPermission('users:read')) {
    return (
      <ErrorState
        title="Accès non autorisé"
        message="Vous n'avez pas les permissions nécessaires pour accéder à la gestion des utilisateurs."
      />
    );
  }

  const canManageGroups = hasPermission('groups:read');

  return (
    <div className="space-y-6">
      <UsersHeader onAddUser={handleAddUser} onAddGroup={handleAddGroup} />

      <UsersNavigation canManageGroups={canManageGroups}>
        <UsersTab
          users={users || []}
          groups={groups || []}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          groupFilter={groupFilter}
          setGroupFilter={setGroupFilter}
          clearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          onChangePassword={handleChangePassword}
        />

        {canManageGroups && (
          <GroupsTab
            groups={groups || []}
            users={users || []}
            onEditGroup={handleEditGroup}
            onManagePermissions={handleManagePermissions}
            onDeleteGroup={handleDeleteGroup}
          />
        )}
      </UsersNavigation>

      <UsersModals
        isUserModalOpen={isUserModalOpen}
        setIsUserModalOpen={setIsUserModalOpen}
        isGroupModalOpen={isGroupModalOpen}
        setIsGroupModalOpen={setIsGroupModalOpen}
        isPermissionsModalOpen={isPermissionsModalOpen}
        setIsPermissionsModalOpen={setIsPermissionsModalOpen}
        isPasswordModalOpen={isPasswordModalOpen}
        setIsPasswordModalOpen={setIsPasswordModalOpen}
        selectedUser={selectedUser}
        selectedGroup={selectedGroup}
      />
    </div>
  );
};

export default Users;
