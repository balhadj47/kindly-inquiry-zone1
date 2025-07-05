
import { useMemo } from 'react';
import { useRBAC } from '@/contexts/rbac/useRBAC';

export const useSecurePermissions = () => {
  const rbac = useRBAC();

  // Memoize the permissions object to prevent unnecessary re-renders
  const permissions = useMemo(() => {
    const isAuthenticated = !!rbac.currentUser;
    const isAdmin = rbac.isAdmin;
    const isViewOnly = rbac.currentUser?.role_id === 3;

    // Admin users get all permissions
    if (isAdmin) {
      console.log('🔒 Admin user detected, granting all permissions');
      
      return {
        isAuthenticated,
        isAdmin: true,
        isViewOnly: false,
        currentUser: rbac.currentUser,
        canAccessDashboard: true,
        canReadCompanies: true,
        canCreateCompanies: true,
        canUpdateCompanies: true,
        canDeleteCompanies: true,
        canReadVans: true,
        canCreateVans: true,
        canUpdateVans: true,
        canDeleteVans: true,
        canReadUsers: true,
        canCreateUsers: true,
        canUpdateUsers: true,
        canDeleteUsers: true,
        canReadTrips: true,
        canCreateTrips: true,
        canUpdateTrips: true,
        canDeleteTrips: true,
        canReadAuthUsers: true,
        canCreateAuthUsers: true,
        canUpdateAuthUsers: true,
        canDeleteAuthUsers: true,
        errors: rbac.errors || {}
      };
    }

    // For authenticated users, give basic read permissions by default
    if (isAuthenticated) {
      console.log('🔒 Authenticated user, providing basic permissions');
      
      return {
        isAuthenticated,
        isAdmin: false,
        isViewOnly,
        currentUser: rbac.currentUser,
        canAccessDashboard: true,
        canReadCompanies: true,
        canCreateCompanies: false,
        canUpdateCompanies: false,
        canDeleteCompanies: false,
        canReadVans: true,
        canCreateVans: false,
        canUpdateVans: false,
        canDeleteVans: false,
        canReadUsers: true,
        canCreateUsers: false,
        canUpdateUsers: false,
        canDeleteUsers: false,
        canReadTrips: true,
        canCreateTrips: false,
        canUpdateTrips: false,
        canDeleteTrips: false,
        canReadAuthUsers: false,
        canCreateAuthUsers: false,
        canUpdateAuthUsers: false,
        canDeleteAuthUsers: false,
        errors: rbac.errors || {}
      };
    }

    console.log('🔒 No authentication, denying all permissions');
    
    // Not authenticated - deny all permissions
    return {
      isAuthenticated: false,
      isAdmin: false,
      isViewOnly: false,
      currentUser: null,
      canAccessDashboard: false,
      canReadCompanies: false,
      canCreateCompanies: false,
      canUpdateCompanies: false,
      canDeleteCompanies: false,
      canReadVans: false,
      canCreateVans: false,
      canUpdateVans: false,
      canDeleteVans: false,
      canReadUsers: false,
      canCreateUsers: false,
      canUpdateUsers: false,
      canDeleteUsers: false,
      canReadTrips: false,
      canCreateTrips: false,
      canUpdateTrips: false,
      canDeleteTrips: false,
      canReadAuthUsers: false,
      canCreateAuthUsers: false,
      canUpdateAuthUsers: false,
      canDeleteAuthUsers: false,
      errors: rbac.errors || {}
    };
  }, [
    rbac.currentUser,
    rbac.isAdmin,
    rbac.permissions,
    rbac.errors
  ]);

  return permissions;
};
