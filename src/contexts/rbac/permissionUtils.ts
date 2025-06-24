
import { User } from '@/types/rbac';
import { SystemGroup } from '@/types/systemGroups';

let permissionCache = new Map<string, boolean>();
let currentAuthUser: User | null = null;
let systemGroupsData: SystemGroup[] = [];

export const createPermissionUtils = (users: User[], systemGroups: SystemGroup[]) => {
  console.log('🔧 Creating database-driven permission utils with:', { 
    usersCount: users.length, 
    systemGroupsCount: systemGroups.length,
    systemGroups: systemGroups.map(g => ({ 
      id: g.id, 
      name: g.name, 
      role_id: (g as any).role_id,
      permissions: g.permissions 
    }))
  });
  
  if (systemGroups.length === 0) {
    console.warn('⚠️ No system groups provided to permission utils - permissions may not work');
    return;
  }

  // Store the current auth user (should be only one)
  currentAuthUser = users.length > 0 ? users[0] : null;
  systemGroupsData = systemGroups;
  permissionCache.clear();
  
  console.log('✅ Database-driven permission utilities created successfully');
  console.log('👤 Current auth user:', currentAuthUser?.id, 'role_id:', currentAuthUser?.role_id);
  console.log('📋 Available system groups:', systemGroupsData.map(g => `${g.name} (role_id: ${(g as any).role_id})`));
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
    console.log(`🔐 Checking database permission: ${permission} for user ${userId}`);
    
    // Use current auth user instead of looking up in users array
    const user = currentAuthUser;
    if (!user || user.id.toString() !== userId.toString()) {
      console.warn(`⚠️ User not found or mismatch: ${userId} vs ${user?.id}`);
      permissionCache.set(cacheKey, false);
      return false;
    }

    console.log(`👤 Found auth user: ${user.id} with role_id: ${user.role_id}`);

    // For role_id 1 (Administrator), grant all permissions
    if (user.role_id === 1) {
      console.log('🔓 Administrator user detected, granting all permissions:', permission);
      permissionCache.set(cacheKey, true);
      return true;
    }

    // Find the user's role/group by role_id from database groups
    const userRole = systemGroupsData.find(role => {
      const roleId = (role as any).role_id || parseInt(role.id);
      return roleId === user.role_id;
    });

    if (!userRole) {
      console.warn(`⚠️ Role not found for user ${userId} with role_id ${user.role_id}`);
      console.log('Available roles:', systemGroupsData.map(r => ({ 
        id: r.id, 
        name: r.name, 
        role_id: (r as any).role_id 
      })));
      permissionCache.set(cacheKey, false);
      return false;
    }

    console.log(`🎯 Found user role: ${userRole.name} (role_id: ${(userRole as any).role_id}) with permissions:`, userRole.permissions);

    // Check if the role has the required permission from database
    const hasAccess = userRole.permissions.includes(permission);
    
    permissionCache.set(cacheKey, hasAccess);
    console.log(`🔐 Database permission check result: ${permission} = ${hasAccess} for user ${userId} (role: ${userRole.name})`);
    
    return hasAccess;
  } catch (error) {
    console.error('❌ Error checking database permission:', error);
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

    // Find the user's role/group by role_id
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
