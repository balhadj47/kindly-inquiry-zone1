
import { useAuth } from '@/contexts/AuthContext';
import { useRBAC } from '@/contexts/RBACContext';

export const usePermissions = () => {
  const { user: authUser } = useAuth();
  const { currentUser, hasPermission, roles } = useRBAC();

  // Simple helper to check if user is high privilege (admin/supervisor)
  const isHighPrivilegeUser = (): boolean => {
    if (!currentUser?.role_id || !roles) return false;
    
    const userRole = roles.find(role => (role as any).role_id === currentUser.role_id);
    if (!userRole) return false;
    
    // High privilege users have many permissions (10+)
    return userRole.permissions.length >= 10;
  };

  // Simplified permission checker with fallbacks
  const checkPermission = (permission: string): boolean => {
    // If no auth user, deny access
    if (!authUser) return false;

    // High privilege user bypass
    if (isHighPrivilegeUser()) return true;

    // Use RBAC permission check if available
    if (hasPermission && typeof hasPermission === 'function') {
      try {
        return hasPermission(permission);
      } catch (error) {
        console.warn('Permission check failed:', error);
        return false;
      }
    }

    // Default deny
    return false;
  };

  return {
    isAuthenticated: !!authUser,
    isHighPrivilegeUser: isHighPrivilegeUser(),
    checkPermission,
    // Specific permission helpers
    canReadCompanies: checkPermission('companies:read'),
    canCreateCompanies: checkPermission('companies:create'),
    canUpdateCompanies: checkPermission('companies:update'),
    canDeleteCompanies: checkPermission('companies:delete'),
    canReadVans: checkPermission('vans:read'),
    canCreateVans: checkPermission('vans:create'),
    canUpdateVans: checkPermission('vans:update'),
    canDeleteVans: checkPermission('vans:delete'),
    canReadUsers: checkPermission('users:read'),
    canCreateUsers: checkPermission('users:create'),
    canUpdateUsers: checkPermission('users:update'),
    canDeleteUsers: checkPermission('users:delete'),
    canReadTrips: checkPermission('trips:read'),
    canCreateTrips: checkPermission('trips:create'),
    canUpdateTrips: checkPermission('trips:update'),
    canDeleteTrips: checkPermission('trips:delete'),
    canReadAuthUsers: checkPermission('auth-users:read'),
    canAccessDashboard: checkPermission('dashboard:read'),
  };
};
