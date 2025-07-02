
import React from 'react';
import { useSecurePermissions } from '@/hooks/useSecurePermissions';
import { useRoleData } from '@/hooks/useRoleData';
import AuthUsers from '@/components/AuthUsers';

const AuthUsersPage = () => {
  const permissions = useSecurePermissions();
  const { roleName } = useRoleData(0); // Default role for display
  
  console.log('🔍 AuthUsersPage rendering:', {
    isAuthenticated: permissions.isAuthenticated,
    canReadAuthUsers: permissions.canReadAuthUsers,
    isAdmin: permissions.isAdmin,
    currentUserRole: permissions.currentUser?.role_id
  });

  if (!permissions.isAuthenticated) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Authentification requise</h2>
        <p className="text-gray-600">Vous devez être connecté pour accéder à la gestion des comptes.</p>
      </div>
    );
  }

  if (!permissions.canReadAuthUsers) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Accès restreint</h2>
        <p className="text-gray-600">
          Cette fonctionnalité nécessite des permissions d'administrateur.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Rôle actuel: {roleName || 'Inconnu'} (ID: {permissions.currentUser?.role_id})
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Admin: {permissions.isAdmin ? 'Oui' : 'Non'}
        </p>
      </div>
    );
  }

  return <AuthUsers />;
};

export default AuthUsersPage;
