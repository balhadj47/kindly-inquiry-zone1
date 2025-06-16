
import type { User, Role } from '@/types/rbac';

export const createPermissionUtils = (currentUser: User | null, roles: Role[]) => {
  const hasPermission = (permission: string): boolean => {
    if (!currentUser) {
      console.log('No current user, denying permission:', permission);
      return false;
    }

    // Find the user's role
    const userRole = roles.find(role => 
      role.id === currentUser.role.toLowerCase().replace(/\s+/g, '-') ||
      role.name === currentUser.role
    );

    if (!userRole) {
      console.log('No role found for user, denying permission:', permission, 'user role:', currentUser.role);
      return false;
    }

    const hasPermissionResult = userRole.permissions.includes(permission);
    console.log('Permission check:', {
      user: currentUser.name,
      userRole: userRole.name,
      permission,
      hasPermission: hasPermissionResult,
      rolePermissions: userRole.permissions
    });

    return hasPermissionResult;
  };

  const getMenuItemPermissions = () => {
    return {
      dashboard: hasPermission('dashboard:read'),
      companies: hasPermission('companies:read'),
      vans: hasPermission('vans:read'),
      users: hasPermission('users:read'),
      tripLogger: hasPermission('trips:create'),
      tripHistory: hasPermission('trips:read'),
    };
  };

  return { hasPermission, getMenuItemPermissions };
};
