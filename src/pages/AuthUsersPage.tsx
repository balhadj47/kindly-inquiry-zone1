
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRBAC } from '@/contexts/RBACContext';
import { useRoleData } from '@/hooks/useRoleData';
import AuthUsers from '@/components/AuthUsers';

const AuthUsersPage = () => {
  const { user: authUser, loading: authLoading } = useAuth();
  const { currentUser, hasPermission, loading: rbacLoading, roles } = useRBAC();
  const { roleName } = useRoleData(currentUser?.role_id || 0);
  
  console.log('🔍 AuthUsersPage rendering for user:', authUser?.email);

  if (authLoading || rbacLoading) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Chargement...</h2>
        <p className="text-gray-600">Vérification des permissions en cours...</p>
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

  // Dynamic privilege detection
  const isHighPrivilegeUser = () => {
    if (!currentUser?.role_id || !roles) return false;
    
    const userRole = roles.find(role => (role as any).role_id === currentUser.role_id);
    if (!userRole) return false;
    
    // High privilege users have many permissions (10+)
    return userRole.permissions.length >= 10;
  };

  const hasAuthUsersPermission = isHighPrivilegeUser() || (hasPermission && hasPermission('users:read'));

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
