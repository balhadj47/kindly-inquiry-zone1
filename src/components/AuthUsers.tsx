
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus, ExternalLink, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshButton } from '@/components/ui/refresh-button';
import { roleIdHasPermission } from '@/utils/rolePermissions';
import { useAuthUsers, useAuthUserMutations } from '@/hooks/useAuthUsers';
import AuthUsersHeader from './auth-users/AuthUsersHeader';
import AuthUsersFilters from './auth-users/AuthUsersFilters';
import AuthUsersList from './auth-users/AuthUsersList';
import AuthUserDeleteDialog from '@/components/auth-users/AuthUserDeleteDialog';
import AuthUserEditDialog from '@/components/auth-users/AuthUserEditDialog';
import AuthUserCreateDialog from '@/components/auth-users/AuthUserCreateDialog';

interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  phone: string | null;
  role: string;
  user_metadata: any;
}

const AuthUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; user: AuthUser | null }>({
    isOpen: false,
    user: null
  });
  const [editDialog, setEditDialog] = useState<{ isOpen: boolean; user: AuthUser | null }>({
    isOpen: false,
    user: null
  });
  const [createDialog, setCreateDialog] = useState<{ isOpen: boolean }>({
    isOpen: false
  });
  const { user: authUser } = useAuth();

  // Use the new caching hook
  const { data: authUsers = [], isLoading: loading, error, refetch } = useAuthUsers();
  const { deleteAuthUser, updateAuthUser, createAuthUser } = useAuthUserMutations();

  const handleDeleteUser = async (userId: string) => {
    if (!userId) return;
    try {
      await deleteAuthUser.mutateAsync(userId);
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleUpdateUser = async (userId: string, updateData: { email?: string; role_id?: number; name?: string }) => {
    if (!userId || !updateData || Object.keys(updateData).length === 0) return;
    try {
      await updateAuthUser.mutateAsync({ userId, updateData });
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleAddUser = () => {
    console.log('🆕 AuthUsers: Adding new user');
    setCreateDialog({ isOpen: true });
  };

  const handleEditUser = (user: AuthUser) => {
    console.log('✏️ AuthUsers: Editing user:', user.id, user.email);
    setEditDialog({ isOpen: true, user });
  };

  const handleDeleteUserDialog = (user: AuthUser) => {
    console.log('🗑️ AuthUsers: Preparing to delete user:', user.id, user.email);
    setDeleteDialog({ isOpen: true, user });
  };

  const handleCreateUser = async (userData: { email: string; password: string; name: string; role_id: number }) => {
    try {
      await createAuthUser.mutateAsync(userData);
      setCreateDialog({ isOpen: false });
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  // Check permissions
  const userRoleId = authUser?.user_metadata?.role_id || 0;
  const isKnownAdmin = authUser?.email === 'gb47@msn.com';
  const hasAdminPermission = roleIdHasPermission(userRoleId, 'users:read') || isKnownAdmin;
  const canCreateUsers = hasAdminPermission;
  const canEditUsers = hasAdminPermission;
  const canDeleteUsers = hasAdminPermission;

  // Handle error states
  const showAdminError = error?.message.includes('Insufficient permissions');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des comptes d'authentification...</div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Authentification requise</h2>
        <p className="text-gray-600">Vous devez être connecté pour accéder à la gestion des comptes.</p>
      </div>
    );
  }

  if (showAdminError || !hasAdminPermission) {
    return (
      <div className="space-y-6 max-w-full overflow-hidden">
        <div className="flex items-center justify-between">
          <AuthUsersHeader authUsersCount={0} />
        </div>

        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Permissions insuffisantes</strong>
            <br />
            Vous n'avez pas les permissions nécessaires pour accéder à cette fonctionnalité.
            Seuls les administrateurs peuvent gérer les utilisateurs d'authentification.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ExternalLink className="h-5 w-5 text-blue-500" />
              <span>Tableau de bord Supabase</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Vous pouvez gérer les utilisateurs d'authentification directement via le tableau de bord Supabase :
            </p>
            <Button 
              onClick={() => window.open('https://supabase.com/dashboard/project/upaxlykqpbpvwsprcrtu/auth/users', '_blank')}
              className="w-full flex items-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Ouvrir le tableau de bord Supabase</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <AuthUsersHeader authUsersCount={authUsers.length} />
        <div className="flex items-center space-x-2">
          {canCreateUsers && (
            <Button onClick={handleAddUser} variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          )}
          <RefreshButton onRefresh={() => refetch()} />
        </div>
      </div>

      <AuthUsersFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        clearFilters={clearFilters}
        authUsers={authUsers}
      />

      <AuthUsersList
        authUsers={authUsers}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUserDialog}
        canEdit={canEditUsers}
        canDelete={canDeleteUsers}
        actionLoading={deleteAuthUser.isPending || updateAuthUser.isPending || createAuthUser.isPending ? 'loading' : null}
      />

      <AuthUserDeleteDialog
        isOpen={deleteDialog.isOpen}
        user={deleteDialog.user}
        onConfirm={() => {
          if (deleteDialog.user) {
            handleDeleteUser(deleteDialog.user.id);
          }
          setDeleteDialog({ isOpen: false, user: null });
        }}
        onCancel={() => setDeleteDialog({ isOpen: false, user: null })}
      />

      <AuthUserEditDialog
        isOpen={editDialog.isOpen}
        user={editDialog.user}
        onConfirm={(updateData) => {
          if (editDialog.user) {
            handleUpdateUser(editDialog.user.id, updateData);
          }
          setEditDialog({ isOpen: false, user: null });
        }}
        onCancel={() => setEditDialog({ isOpen: false, user: null })}
      />

      <AuthUserCreateDialog
        isOpen={createDialog.isOpen}
        onConfirm={handleCreateUser}
        onCancel={() => setCreateDialog({ isOpen: false })}
        isLoading={createAuthUser.isPending}
      />
    </div>
  );
};

export default AuthUsers;
