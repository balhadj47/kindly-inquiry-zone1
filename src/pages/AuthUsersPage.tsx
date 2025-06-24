
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthUsers from '@/components/AuthUsers';
import { roleIdHasPermission } from '@/utils/rolePermissions';

const AuthUsersPage = () => {
  const { user: authUser } = useAuth();
  
  // Check if user has auth users permissions
  const userRoleId = authUser?.user_metadata?.role_id || 0;
  const isKnownAdmin = authUser?.email === 'gb47@msn.com';
  const hasAuthUsersPermission = roleIdHasPermission(userRoleId, 'auth-users:read') || isKnownAdmin;

  console.log('🔍 AuthUsersPage permissions check:', {
    email: authUser?.email,
    userRoleId,
    isKnownAdmin,
    hasAuthUsersPermission,
    metadata: authUser?.user_metadata
  });

  if (!authUser) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Authentification requise</h2>
        <p className="text-gray-600">Vous devez être connecté pour accéder à la gestion des comptes.</p>
      </div>
    );
  }

  if (!hasAuthUsersPermission) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Accès restreint</h2>
        <p className="text-gray-600">
          Cette fonctionnalité nécessite des permissions d'administrateur.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Rôle actuel: {userRoleId === 1 ? 'Administrateur' : userRoleId === 2 ? 'Superviseur' : 'Employé'}
        </p>
      </div>
    );
  }

  return <AuthUsers />;
};

export default AuthUsersPage;
