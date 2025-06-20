
import { User } from '@/types/rbac';
import { SystemGroup } from '@/types/systemGroups';

let permissionCache = new Map<string, boolean>();
let usersData: User[] = [];
let systemGroupsData: SystemGroup[] = [];

export const createPermissionUtils = (users: User[], systemGroups: SystemGroup[]) => {
  console.log('🔧 Creating permission utils with:', { 
    usersCount: users.length, 
    systemGroupsCount: systemGroups.length,
    systemGroups: systemGroups.map(g => ({ name: g.name, permissions: g.permissions }))
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
    const result = permissionCache.get(cacheKey)!;
    console.log(`🔐 Cache hit: ${permission} = ${result} for user ${userId}`);
    return result;
  }

  try {
    console.log(`🔐 Checking permission: ${permission} for user ${userId}`);
    
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

    console.log(`👤 Found user: ${user.id} with role_id: ${user.role_id}`);

    // For role_id 1 (Administrator), grant all permissions
    if (user.role_id === 1) {
      console.log('🔓 Administrator user detected, granting all permissions:', permission);
      permissionCache.set(cacheKey, true);
      return true;
    }

    // Find the user's role/group by role_id - use the systemGroups from database
    const userRole = systemGroupsData.find(role => {
      // Convert role.id to number for comparison with user.role_id
      return parseInt(role.id) === user.role_id;
    });

    if (!userRole) {
      console.warn(`⚠️ Role not found for user ${userId} with role_id ${user.role_id}`);
      console.log('Available roles:', systemGroupsData.map(r => ({ id: r.id, name: r.name })));
      permissionCache.set(cacheKey, false);
      return false;
    }

    console.log(`🎯 Found user role: ${userRole.name} with permissions:`, userRole.permissions);

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
      return parseInt(role.id) === user.role_id;
    });

    return userRole?.permissions || [];
  } catch (error) {
    console.error('❌ Error getting user permissions:', error);
    return [];
  }
};
