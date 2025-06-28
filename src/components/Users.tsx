
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
import { PlusButton } from '@/components/ui/plus-button';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  
  const { users, hasPermission, loading, currentUser, roles } = useRBAC();
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

  // Refresh data when component mounts (user enters the page)
  useEffect(() => {
    console.log('👥 Users component mounted, refreshing data');
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

  // Dynamic privilege detection
  const isHighPrivilegeUser = () => {
    if (!currentUser?.role_id || !roles) return false;
    
    const userRole = roles.find(role => (role as any).role_id === currentUser.role_id);
    if (!userRole) return false;
    
    // High privilege users have many permissions (10+)
    return userRole.permissions.length >= 10;
  };

  // Check if user can manage groups and create users
  const canManageGroups = hasPermission('groups:read') || hasPermission('groups:manage') || isHighPrivilegeUser();
  const canCreateUsers = hasPermission('users:create');

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

  // Check if user has permission to view users - dynamic privilege check
  const hasUsersReadPermission = hasPermission('users:read') || isHighPrivilegeUser();

  if (!hasUsersReadPermission && !loading) {
    console.log('Users component: No permission to read users');
    return (
      <ErrorState
        title="Accès non autorisé"
        message="Vous n'avez pas les permissions nécessaires pour accéder à la gestion des utilisateurs."
      />
    );
  }

  // If currentUser is not found but user is authenticated and high privilege, allow access
  if (!currentUser && !isHighPrivilegeUser() && !loading) {
    console.log('Users component: Current user not found and not high privilege user');
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
        <UsersHeader />
        <div className="flex items-center space-x-2">
          {canCreateUsers && (
            <PlusButton onClick={handleAddUser} />
          )}
          <RefreshButton onRefresh={handleRefresh} />
        </div>
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
