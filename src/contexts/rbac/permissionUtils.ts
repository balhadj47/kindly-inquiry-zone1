
import { User } from '@/types/rbac';
import { SystemGroup } from '@/types/systemGroups';
import { getPermissionsForRoleId } from '@/utils/rolePermissions';

let permissionCache = new Map<string, boolean>();
let usersData: User[] = [];
let systemGroupsData: SystemGroup[] = [];

export const createPermissionUtils = (users: User[], systemGroups: SystemGroup[]) => {
  console.log('🔧 Creating permission utils with:', { 
    usersCount: users.length, 
    systemGroupsCount: systemGroups.length 
  });
  
  if (users.length === 0 || systemGroups.length === 0) {
    console.warn('⚠️ Skipping permission utils creation - missing data');
    return;
  }

  usersData = users;
  systemGroupsData = systemGroups;
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
    // Special handling for admin temp user
    if (userId === 'admin-temp') {
      console.log('🔓 Admin temp user detected, granting permission:', permission);
      permissionCache.set(cacheKey, true);
      return true;
    }

    // Find user
    const user = usersData.find(u => u.id.toString() === userId.toString());
    if (!user) {
      console.warn(`⚠️ User not found: ${userId}`);
      permissionCache.set(cacheKey, false);
      return false;
    }

    // Special handling for Administrator role_id (1)
    if (user.role_id === 1) {
      console.log('🔓 Administrator user detected, granting permission:', permission);
      permissionCache.set(cacheKey, true);
      return true;
    }

    // Get permissions for the user's role_id
    const userPermissions = getPermissionsForRoleId(user.role_id);
    const hasAccess = userPermissions.includes(permission);
    
    permissionCache.set(cacheKey, hasAccess);
    console.log(`🔐 Permission check result: ${permission} = ${hasAccess} for user ${userId} (role_id: ${user.role_id})`);
    
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

    return getPermissionsForRoleId(user.role_id);
  } catch (error) {
    console.error('❌ Error getting user permissions:', error);
    return [];
  }
};
