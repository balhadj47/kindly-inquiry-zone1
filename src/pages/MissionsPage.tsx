
import React from 'react';
import { useSecurePermissions } from '@/hooks/useSecurePermissions';
import { useRoleData } from '@/hooks/useRoleData';
import { useDataPreloader } from '@/hooks/useDataPreloader';
import MissionsContainer from '@/components/missions/MissionsContainer';

const MissionsPage = () => {
  const permissions = useSecurePermissions();
  const { roleName } = useRoleData(0); // Default role for display
  
  // Preload vans and users data when entering missions page
  useDataPreloader({
    preloadVans: true,
    preloadUsers: true,
    preloadCompanies: true
  });
  
  console.log('🎯 MissionsPage rendering:', {
    isAuthenticated: permissions.isAuthenticated,
    canReadTrips: permissions.canReadTrips
  });

  if (!permissions.isAuthenticated) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Authentification requise</h2>
        <p className="text-gray-600">Vous devez être connecté pour accéder aux missions.</p>
      </div>
    );
  }

  if (!permissions.canReadTrips) {
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

  return <MissionsContainer />;
};

export default MissionsPage;
