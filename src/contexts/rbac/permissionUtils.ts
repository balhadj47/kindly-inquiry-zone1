
import { User, Role } from '@/types/rbac';

let permissionCache = new Map<string, boolean>();
let usersData: User[] = [];
let rolesData: Role[] = [];

export const createPermissionUtils = (users: User[], roles: Role[]) => {
  console.log('🔧 Creating permission utils with:', { 
    usersCount: users.length, 
    rolesCount: roles.length 
  });
  
  if (users.length === 0 || roles.length === 0) {
    console.warn('⚠️ Skipping permission utils creation - missing data');
    return;
  }

  usersData = users;
  rolesData = roles;
  permissionCache.clear();
  console.log('✅ Permission utilities created successfully');
};

export const hasPermission = (userId: string, permission: string): boolean => {
  const cacheKey = `${userId}-${permission}`;
  
  // Check cache first
  if (permissionCache.has(cacheKey)) {
    return permissionCache.get(cacheKey)!;
  }

  try {
    // Find user
    const user = usersData.find(u => u.id.toString() === userId.toString());
    if (!user) {
      console.warn(`⚠️ User not found: ${userId}`);
      permissionCache.set(cacheKey, false);
      return false;
    }

    // Find role
    const role = rolesData.find(r => r.name === user.role);
    if (!role) {
      console.warn(`⚠️ Role not found: ${user.role}`);
      permissionCache.set(cacheKey, false);
      return false;
    }

    // Check permission
    const hasAccess = role.permissions.includes(permission);
    permissionCache.set(cacheKey, hasAccess);
    
    return hasAccess;
  } catch (error) {
    console.error('❌ Error checking permission:', error);
    permissionCache.set(cacheKey, false);
    return false;
  }
};

export const clearPermissionCache = () => {
  console.log('🧹 Clearing permission cache');
  permissionCache.clear();
};

export const getUserPermissions = (userId: string): string[] => {
  try {
    const user = usersData.find(u => u.id.toString() === userId.toString());
    if (!user) return [];

    const role = rolesData.find(r => r.name === user.role);
    return role?.permissions || [];
  } catch (error) {
    console.error('❌ Error getting user permissions:', error);
    return [];
  }
};
