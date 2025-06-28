
import { User } from '@/types/rbac';
import { SystemGroup } from '@/types/systemGroups';

let permissionCache = new Map<string, boolean>();
let currentAuthUser: User | null = null;
let systemGroupsData: SystemGroup[] = [];

export const createPermissionUtils = (users: User[], systemGroups: SystemGroup[]) => {
  console.log('🔧 Creating permission utils:', { 
    usersCount: users.length, 
    systemGroupsCount: systemGroups.length
  });
  
  if (systemGroups.length === 0) {
    console.warn('⚠️ No system groups provided to permission utils');
    return;
  }

  currentAuthUser = users.length > 0 ? users[0] : null;
  systemGroupsData = systemGroups;
  permissionCache.clear();
  
  console.log('✅ Permission utilities created successfully');
};

export const hasPermission = (userId: string, permission: string): boolean => {
  const cacheKey = `${userId}-${permission}`;
  
  if (permissionCache.has(cacheKey)) {
    return permissionCache.get(cacheKey)!;
  }

  try {
    console.log(`🔐 Checking permission: ${permission} for user ${userId}`);
    
    const user = currentAuthUser;
    if (!user || user.id.toString() !== userId.toString()) {
      console.warn(`⚠️ User not found: ${userId}`);
      permissionCache.set(cacheKey, false);
      return false;
    }

    const userRole = systemGroupsData.find(role => {
      const roleId = (role as any).role_id || parseInt(role.id);
      return roleId === user.role_id;
    });

    if (!userRole) {
      console.warn(`⚠️ Role not found for user ${userId} with role_id ${user.role_id}`);
      permissionCache.set(cacheKey, false);
      return false;
    }

    const hasAccess = userRole.permissions.includes(permission);
    
    // High-privilege role handling
    if (!hasAccess && userRole.permissions.length >= 10) {
      console.log('🔓 High-privilege role, granting permission:', permission);
      permissionCache.set(cacheKey, true);
      return true;
    }
    
    permissionCache.set(cacheKey, hasAccess);
    console.log(`🔐 Permission result: ${permission} = ${hasAccess}`);
    
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
    const user = currentAuthUser;
    if (!user || user.id.toString() !== userId.toString()) return [];

    const userRole = systemGroupsData.find(role => {
      const roleId = (role as any).role_id || parseInt(role.id);
      return roleId === user.role_id;
    });

    return userRole?.permissions || [];
  } catch (error) {
    console.error('❌ Error getting user permissions:', error);
    return [];
  }
};
