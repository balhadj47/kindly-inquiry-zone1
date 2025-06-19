
import React, { useState, useEffect } from 'react';
import { useRBAC } from '@/contexts/RBACContext';
import { useAuth } from '@/contexts/AuthContext';
import UsersHeader from './users/UsersHeader';
import UsersNavigation from './users/UsersNavigation';
import UsersTab from './users/UsersTab';
import UsersModals from './users/UsersModals';
import { LoadingState, ErrorState } from './users/UsersStates';
import { useUserActionHandlers } from './users/UserActionHandlers';
import { useCacheRefresh } from '@/hooks/useCacheRefresh';
import { RefreshButton } from '@/components/ui/refresh-button';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  
  const { users, hasPermission, loading, currentUser } = useRBAC();
  const { user: authUser } = useAuth();
  const { refreshPage } = useCacheRefresh();

  console.log('Users component render state:', {
    usersCount: users?.length || 0,
    currentUser,
    authUser,
    loading,
    authUserEmail: authUser?.email
  });

  const {
    isUserModalOpen,
    setIsUserModalOpen,
    isPasswordModalOpen,
    setIsPasswordModalOpen,
    selectedUser,
    handleAddUser,
    handleEditUser,
    handleChangePassword,
    handleDeleteUser,
  } = useUserActionHandlers();

  // Clear cache and refresh data when component mounts
  useEffect(() => {
    refreshPage(['users', 'user_groups']);
  }, [refreshPage]);

  const handleRefresh = () => {
    refreshPage(['users', 'user_groups']);
  };

  // Debug permissions
  console.log('Users component - Permission checks:', {
    'users:read': hasPermission('users:read'),
    'users:create': hasPermission('users:create'),
    'groups:read': hasPermission('groups:read'),
    'groups:manage': hasPermission('groups:manage'),
    currentUserRoleId: currentUser?.role_id
  });

  // Check if user can manage groups
  const canManageGroups = hasPermission('groups:read') || hasPermission('groups:manage') || currentUser?.role_id === 1;

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setRoleFilter('all');
  };

  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'all' || roleFilter !== 'all';

  if (loading) {
    console.log('Users component: Still loading, showing loading state');
    return <LoadingState />;
  }

  // Show message if user is not authenticated
  if (!authUser) {
    console.log('Users component: No auth user, showing auth required message');
    return (
      <ErrorState
        title="Authentification requise"
        message="Vous devez être connecté pour accéder à la gestion des utilisateurs."
      />
    );
  }

  // Check if user has permission to view users - allow admin emails even if currentUser is null
  const isKnownAdmin = authUser.email === 'gb47@msn.com';
  const hasUsersReadPermission = hasPermission('users:read') || isKnownAdmin;

  if (!hasUsersReadPermission && !loading) {
    console.log('Users component: No permission to read users');
    return (
      <ErrorState
        title="Accès non autorisé"
        message="Vous n'avez pas les permissions nécessaires pour accéder à la gestion des utilisateurs."
      />
    );
  }

  // If currentUser is not found but user is authenticated and known admin, allow access
  if (!currentUser && !isKnownAdmin && !loading) {
    console.log('Users component: Current user not found and not known admin');
    return (
      <ErrorState
        title="Profil utilisateur introuvable"
        message="Votre profil utilisateur n'a pas été trouvé dans le système. Veuillez contacter un administrateur."
      />
    );
  }

  console.log('Users component: Rendering main interface');

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <UsersHeader onAddUser={handleAddUser} />
        <RefreshButton onRefresh={handleRefresh} />
      </div>

      <UsersNavigation canManageGroups={canManageGroups}>
        <UsersTab
          users={users || []}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          clearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          onChangePassword={handleChangePassword}
        />
      </UsersNavigation>

      <UsersModals
        isUserModalOpen={isUserModalOpen}
        setIsUserModalOpen={setIsUserModalOpen}
        isPasswordModalOpen={isPasswordModalOpen}
        setIsPasswordModalOpen={setIsPasswordModalOpen}
        selectedUser={selectedUser}
      />
    </div>
  );
};

export default Users;
