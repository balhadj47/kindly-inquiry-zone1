
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthUsers from '@/components/AuthUsers';
import { roleIdHasPermission } from '@/utils/rolePermissions';

const AuthUsersPage = () => {
  const { user: authUser } = useAuth();
  
  // Check if user has admin permissions
  const userRoleId = (authUser as any)?.role_id || 0;
  const hasAdminPermission = roleIdHasPermission(userRoleId, 'users:read') || authUser?.email === 'gb47@msn.com';

  if (!authUser) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Authentification requise</h2>
        <p className="text-gray-600">Vous devez être connecté pour accéder à la gestion des utilisateurs d'authentification.</p>
      </div>
    );
  }

  if (!hasAdminPermission) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Accès non autorisé</h2>
        <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder à la gestion des utilisateurs d'authentification.</p>
      </div>
    );
  }

  return <AuthUsers />;
};

export default AuthUsersPage;
