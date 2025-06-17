
import { User } from '@/types/rbac';
import { SystemGroup } from '@/types/systemGroups';

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
    // Find user
    const user = usersData.find(u => u.id.toString() === userId.toString());
    if (!user) {
      console.warn(`⚠️ User not found: ${userId}`);
      permissionCache.set(cacheKey, false);
      return false;
    }

    // Find system group
    const systemGroup = systemGroupsData.find(g => g.name === user.systemGroup);
    if (!systemGroup) {
      console.warn(`⚠️ System group not found: ${user.systemGroup}`);
      permissionCache.set(cacheKey, false);
      return false;
    }

    // Check permission
    const hasAccess = systemGroup.permissions.includes(permission);
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

    const systemGroup = systemGroupsData.find(g => g.name === user.systemGroup);
    return systemGroup?.permissions || [];
  } catch (error) {
    console.error('❌ Error getting user permissions:', error);
    return [];
  }
};
