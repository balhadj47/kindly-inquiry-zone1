
import { useSecurePermissions } from './useSecurePermissions';

export const usePermissionCheck = () => {
  const permissions = useSecurePermissions();

  return {
    // Companies permissions
    canReadCompanies: permissions.canReadCompanies,
    canCreateCompanies: permissions.canCreateCompanies,
    canUpdateCompanies: permissions.canUpdateCompanies,
    canDeleteCompanies: permissions.canDeleteCompanies,
    
    // Vans permissions
    canReadVans: permissions.canReadVans,
    canCreateVans: permissions.canCreateVans,
    canUpdateVans: permissions.canUpdateVans,
    canDeleteVans: permissions.canDeleteVans,
    
    // Users permissions
    canReadUsers: permissions.canReadUsers,
    canCreateUsers: permissions.canCreateUsers,
    canUpdateUsers: permissions.canUpdateUsers,
    canDeleteUsers: permissions.canDeleteUsers,
    
    // Trips permissions
    canReadTrips: permissions.canReadTrips,
    canCreateTrips: permissions.canCreateTrips,
    canUpdateTrips: permissions.canUpdateTrips,
    canDeleteTrips: permissions.canDeleteTrips,
    
    // Auth users permissions
    canReadAuthUsers: permissions.canReadAuthUsers,
    
    // Dashboard permissions
    canAccessDashboard: permissions.canAccessDashboard,
    
    // Admin status
    isAdmin: permissions.isAdmin,
    isAuthenticated: permissions.isAuthenticated,
  };
};
