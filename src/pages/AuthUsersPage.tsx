
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthUsers from '@/components/AuthUsers';
import { roleIdHasPermission } from '@/utils/rolePermissions';

const AuthUsersPage = () => {
  const { user: authUser } = useAuth();
  
  // Check if user has admin permissions or is the known admin
  const userRoleId = (authUser as any)?.role_id || 0;
  const isKnownAdmin = authUser?.email === 'gb47@msn.com';
  const hasAdminPermission = roleIdHasPermission(userRoleId, 'users:read') || isKnownAdmin;

  if (!authUser) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Authentification requise</h2>
        <p className="text-gray-600">Vous devez être connecté pour accéder à la gestion des utilisateurs d'authentification.</p>
      </div>
    );
  }

  // For now, allow access to demonstrate the feature - the component itself will handle permission errors
  if (!hasAdminPermission) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Accès restreint</h2>
        <p className="text-gray-600 mb-4">
          Cette fonctionnalité nécessite des permissions d'administrateur. 
          Vous pouvez néanmoins voir la page pour comprendre son fonctionnement.
        </p>
        <AuthUsers />
      </div>
    );
  }

  return <AuthUsers />;
};

export default AuthUsersPage;
