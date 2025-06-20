
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

    // Find the user's role/group by role_id
    const userRole = systemGroupsData.find(role => {
      // Map role_id to system group names
      const roleIdMapping: { [key: number]: string } = {
        1: 'Administrator',
        2: 'Supervisor', 
        3: 'Employee'
      };
      return role.name === roleIdMapping[user.role_id];
    });

    if (!userRole) {
      console.warn(`⚠️ Role not found for user ${userId} with role_id ${user.role_id}`);
      permissionCache.set(cacheKey, false);
      return false;
    }

    // Check if the role has the required permission
    const hasAccess = userRole.permissions.includes(permission);
    
    permissionCache.set(cacheKey, hasAccess);
    console.log(`🔐 Permission check result: ${permission} = ${hasAccess} for user ${userId} (role: ${userRole.name})`);
    
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

    // Find the user's role/group by role_id
    const userRole = systemGroupsData.find(role => {
      const roleIdMapping: { [key: number]: string } = {
        1: 'Administrator',
        2: 'Supervisor',
        3: 'Employee'
      };
      return role.name === roleIdMapping[user.role_id];
    });

    return userRole?.permissions || [];
  } catch (error) {
    console.error('❌ Error getting user permissions:', error);
    return [];
  }
};
