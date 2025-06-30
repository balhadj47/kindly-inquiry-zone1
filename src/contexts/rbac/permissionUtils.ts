
import { User } from '@/types/rbac';
import { SystemGroup } from '@/types/systemGroups';

// Global permission state for caching
let globalCurrentUser: User | null = null;
let globalRoles: SystemGroup[] = [];

// Permission cache for performance
let permissionCache: Map<string, boolean> = new Map();

// Set global state (called from RBACProvider)
export const setGlobalPermissionState = (user: User | null, roles: SystemGroup[]) => {
  globalCurrentUser = user;
  globalRoles = roles;
  // Clear cache when state changes
  permissionCache.clear();
};

// Create permission utilities (for compatibility with existing code)
export const createPermissionUtils = (users: User[], roles: SystemGroup[]) => {
  console.log('🔧 permissionUtils: Creating permission utilities with:', {
    usersCount: users.length,
    rolesCount: roles.length
  });
  
  // Update global state
  setGlobalPermissionState(users[0] || null, roles);
};

// Clear permission cache
export const clearPermissionCache = () => {
  console.log('🔧 permissionUtils: Clearing permission cache');
  permissionCache.clear();
};

// Main permission checking function
export const hasPermission = (userId: string, permission: string): boolean => {
  try {
    console.log('🔐 permissionUtils: hasPermission called:', {
      userId,
      permission,
      currentUserId: globalCurrentUser?.id || 'null',
      rolesCount: globalRoles.length
    });

    // Check cache first
    const cacheKey = `${userId}:${permission}`;
    if (permissionCache.has(cacheKey)) {
      return permissionCache.get(cacheKey)!;
    }

    // Validate permission parameter
    if (!permission || typeof permission !== 'string' || permission.trim() === '') {
      console.warn('🚫 permissionUtils: Invalid permission parameter:', permission);
      permissionCache.set(cacheKey, false);
      return false;
    }

    // Check for current user
    if (!globalCurrentUser || !globalCurrentUser.id || globalCurrentUser.id !== userId) {
      console.log('🚫 permissionUtils: User mismatch or no current user:', {
        globalUserId: globalCurrentUser?.id || 'null',
        requestedUserId: userId
      });
      permissionCache.set(cacheKey, false);
      return false;
    }

    // Special handling for admin users
    if (globalCurrentUser.id === 'admin-temp' || globalCurrentUser.role_id === 1) {
      console.log('🔓 permissionUtils: Admin user detected - granting permission');
      permissionCache.set(cacheKey, true);
      return true;
    }

    // Basic permissions for authenticated users
    const basicPermissions = [
      'dashboard:read', 
      'trips:read', 
      'companies:read',
      'vans:read'
    ];
    
    if (basicPermissions.includes(permission)) {
      console.log('🔓 permissionUtils: Basic permission granted');
      permissionCache.set(cacheKey, true);
      return true;
    }

    // Check if roles are loaded
    if (!Array.isArray(globalRoles) || globalRoles.length === 0) {
      console.log('⚠️ permissionUtils: Roles not loaded, allowing basic permissions only');
      const hasBasic = basicPermissions.includes(permission);
      permissionCache.set(cacheKey, hasBasic);
      return hasBasic;
    }

    // Find user's role and check permissions
    const userRole = globalRoles.find(role => (role as any).role_id === globalCurrentUser.role_id);
    if (!userRole) {
      console.warn('⚠️ permissionUtils: Role not found for user');
      const hasBasic = basicPermissions.includes(permission);
      permissionCache.set(cacheKey, hasBasic);
      return hasBasic;
    }

    const hasAccess = Array.isArray(userRole.permissions) && userRole.permissions.includes(permission);
    console.log('🔐 permissionUtils: Permission check result:', {
      permission,
      hasAccess,
      userPermissions: userRole.permissions || []
    });

    permissionCache.set(cacheKey, hasAccess);
    return hasAccess;

  } catch (error) {
    console.error('❌ permissionUtils: Critical error in permission check:', error);
    
    // Fallback for administrators
    if (globalCurrentUser?.role_id === 1 || globalCurrentUser?.id === 'admin-temp') {
      return true;
    }
    
    // Basic permissions fallback
    const basicPermissions = ['dashboard:read', 'trips:read', 'companies:read', 'vans:read'];
    return basicPermissions.includes(permission);
  }
};

// Get user's role information
export const getUserRole = (userId: string): SystemGroup | null => {
  try {
    if (!globalCurrentUser || globalCurrentUser.id !== userId) {
      return null;
    }
    
    if (!Array.isArray(globalRoles)) {
      return null;
    }
    
    const role = globalRoles.find(r => parseInt(r.id) === globalCurrentUser.role_id);
    return role || null;
  } catch (error) {
    console.error('🔧 permissionUtils: Error in getUserRole:', error);
    return null;
  }
};

// Check if user can perform specific action
export const canUserPerformAction = (userId: string, action: string): boolean => {
  try {
    const userRole = getUserRole(userId);
    if (!userRole) {
      return false;
    }
    
    return Array.isArray(userRole.permissions) && userRole.permissions.includes(action);
  } catch (error) {
    console.error('🔧 permissionUtils: Error in canUserPerformAction:', error);
    return false;
  }
};
