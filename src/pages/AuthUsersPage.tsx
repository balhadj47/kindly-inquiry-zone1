
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRBAC } from '@/contexts/RBACContext';
import { useRoleData } from '@/hooks/useRoleData';
import AuthUsers from '@/components/AuthUsers';

const AuthUsersPage = () => {
  const { user: authUser } = useAuth();
  const { currentUser, hasPermission } = useRBAC();
  const { roleName } = useRoleData(currentUser?.role_id || 0);
  
  console.log('🔍 AuthUsersPage rendering for user:', authUser?.email);

  if (!authUser) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Authentification requise</h2>
        <p className="text-gray-600">Vous devez être connecté pour accéder à la gestion des comptes.</p>
      </div>
    );
  }

  // Simple permission check - admin email or proper permission
  const isKnownAdmin = authUser.email === 'gb47@msn.com';
  const hasAuthUsersPermission = isKnownAdmin || (hasPermission && hasPermission('users:read'));

  if (!hasAuthUsersPermission) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Accès restreint</h2>
        <p className="text-gray-600">
          Cette fonctionnalité nécessite des permissions d'administrateur.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Rôle actuel: {roleName || 'Inconnu'}
        </p>
      </div>
    );
  }

  return <AuthUsers />;
};

export default AuthUsersPage;
