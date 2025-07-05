
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
      console.log('🔒 Admin user, granting permission: companies:read');
      console.log('🔒 Admin user, granting permission: companies:create');
      console.log('🔒 Admin user, granting permission: companies:update');
      console.log('🔒 Admin user, granting permission: companies:delete');
      console.log('🔒 Admin user, granting permission: vans:read');
      console.log('🔒 Admin user, granting permission: vans:create');
      console.log('🔒 Admin user, granting permission: vans:update');
      console.log('🔒 Admin user, granting permission: vans:delete');
      console.log('🔒 Admin user, granting permission: users:read');
      console.log('🔒 Admin user, granting permission: users:create');
      console.log('🔒 Admin user, granting permission: users:update');
      console.log('🔒 Admin user, granting permission: users:delete');
      console.log('🔒 Admin user, granting permission: trips:read');
      console.log('🔒 Admin user, granting permission: trips:create');
      console.log('🔒 Admin user, granting permission: trips:update');
      console.log('🔒 Admin user, granting permission: trips:delete');
      console.log('🔒 Admin user, granting permission: dashboard:read');
      
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

    // Regular permission checking for non-admin users
    const userPermissions = rbac.permissions || [];
    
    const result = {
      isAuthenticated,
      isAdmin: false,
      isViewOnly,
      currentUser: rbac.currentUser,
      canAccessDashboard: userPermissions.includes('dashboard:read'),
      canReadCompanies: userPermissions.includes('companies:read'),
      canCreateCompanies: userPermissions.includes('companies:create'),
      canUpdateCompanies: userPermissions.includes('companies:update'),
      canDeleteCompanies: userPermissions.includes('companies:delete'),
      canReadVans: userPermissions.includes('vans:read'),
      canCreateVans: userPermissions.includes('vans:create'),
      canUpdateVans: userPermissions.includes('vans:update'),
      canDeleteVans: userPermissions.includes('vans:delete'),
      canReadUsers: userPermissions.includes('users:read'),
      canCreateUsers: userPermissions.includes('users:create'),
      canUpdateUsers: userPermissions.includes('users:update'),
      canDeleteUsers: userPermissions.includes('users:delete'),
      canReadTrips: userPermissions.includes('trips:read'),
      canCreateTrips: userPermissions.includes('trips:create'),
      canUpdateTrips: userPermissions.includes('trips:update'),
      canDeleteTrips: userPermissions.includes('trips:delete'),
      canReadAuthUsers: userPermissions.includes('auth-users:read'),
      canCreateAuthUsers: userPermissions.includes('auth-users:create'),
      canUpdateAuthUsers: userPermissions.includes('auth-users:update'),
      canDeleteAuthUsers: userPermissions.includes('auth-users:delete'),
      errors: rbac.errors || {}
    };

    console.log('🔒 Final permissions state:', result);
    return result;
  }, [
    rbac.currentUser,
    rbac.isAdmin,
    rbac.permissions,
    rbac.errors
  ]);

  return permissions;
};
