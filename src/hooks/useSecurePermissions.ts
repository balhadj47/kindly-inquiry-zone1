
import { useMemo } from 'react';
import { useRBAC } from '@/contexts/rbac/useRBAC';

export const useSecurePermissions = () => {
  const rbac = useRBAC();

  // Memoize the permissions object to prevent unnecessary re-renders
  const permissions = useMemo(() => {
    const isAuthenticated = !!rbac.currentUser;
    const isAdmin = rbac.currentUser?.role_id === 1; // Check for admin role_id
    const isViewOnly = rbac.currentUser?.role_id === 3;

    console.log('🔒 useSecurePermissions: Computing permissions', {
      userId: rbac.currentUser?.id,
      roleId: rbac.currentUser?.role_id,
      isAdmin,
      isAuthenticated
    });

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

    // For authenticated users, give appropriate permissions based on role
    if (isAuthenticated) {
      console.log('🔒 Authenticated user, providing role-based permissions', {
        roleId: rbac.currentUser?.role_id,
        isViewOnly
      });
      
      return {
        isAuthenticated,
        isAdmin: false,
        isViewOnly,
        currentUser: rbac.currentUser,
        canAccessDashboard: true,
        canReadCompanies: true,
        canCreateCompanies: !isViewOnly,
        canUpdateCompanies: !isViewOnly,
        canDeleteCompanies: !isViewOnly,
        canReadVans: true,
        canCreateVans: !isViewOnly,
        canUpdateVans: !isViewOnly,
        canDeleteVans: !isViewOnly,
        canReadUsers: true,
        canCreateUsers: !isViewOnly,
        canUpdateUsers: !isViewOnly,
        canDeleteUsers: !isViewOnly,
        canReadTrips: true,
        canCreateTrips: !isViewOnly,
        canUpdateTrips: !isViewOnly,
        canDeleteTrips: !isViewOnly,
        canReadAuthUsers: false, // Only admins can access auth users
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
    rbac.currentUser?.id,
    rbac.currentUser?.role_id,
    rbac.errors
  ]);

  return permissions;
};
