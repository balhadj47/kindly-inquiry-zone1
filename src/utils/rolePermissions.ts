
import { supabase } from '@/integrations/supabase/client';

// Cache for permissions to avoid repeated database calls
let permissionsCache: Record<number, string[]> = {};
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to get permissions for a role_id using current structure
export const getPermissionsForRoleId = async (roleId: number): Promise<string[]> => {
  console.log('🔐 getPermissionsForRoleId called with roleId:', roleId);
  
  // Check cache first
  const now = Date.now();
  if (permissionsCache[roleId] && (now - cacheTimestamp < CACHE_DURATION)) {
    console.log('🔐 Using cached permissions for role_id', roleId);
    return permissionsCache[roleId];
  }

  try {
    // Get permissions from the array structure in user_groups
    const { data, error } = await supabase
      .from('user_groups')
      .select('permissions')
      .eq('role_id', roleId)
      .single();

    if (error) {
      console.error('❌ Error fetching permissions for role_id', roleId, ':', error);
      return ['dashboard:read']; // Default fallback
    }

    const permissions = Array.isArray(data?.permissions) ? data.permissions : ['dashboard:read'];
    
    // Update cache
    permissionsCache[roleId] = permissions;
    cacheTimestamp = now;
    
    console.log('🔐 Permissions for role_id', roleId, ':', permissions);
    return permissions;
  } catch (error) {
    console.error('❌ Exception fetching permissions for role_id', roleId, ':', error);
    return ['dashboard:read']; // Default fallback
  }
};

// Check if a role_id has a specific permission
export const roleIdHasPermission = async (roleId: number, permission: string): Promise<boolean> => {
  console.log('🔐 roleIdHasPermission called with roleId:', roleId, 'permission:', permission);
  const rolePermissions = await getPermissionsForRoleId(roleId);
  const hasPermission = rolePermissions.includes(permission);
  console.log('🔐 Role', roleId, 'has permission', permission, ':', hasPermission);
  return hasPermission;
};

// Helper function to get role display name by role_id
export const getRoleDisplayNameById = async (roleId: number): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('user_groups')
      .select('name')
      .eq('role_id', roleId)
      .single();

    if (error) {
      console.error('❌ Error fetching role name for role_id', roleId, ':', error);
      return 'Employé'; // Default fallback
    }

    return data?.name || 'Employé';
  } catch (error) {
    console.error('❌ Exception fetching role name for role_id', roleId, ':', error);
    return 'Employé'; // Default fallback
  }
};

// Helper function to get role color by role_id
export const getRoleColorById = async (roleId: number): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('user_groups')
      .select('color')
      .eq('role_id', roleId)
      .single();

    if (error) {
      console.error('❌ Error fetching role color for role_id', roleId, ':', error);
      return '#6b7280'; // Default gray
    }

    return data?.color || '#6b7280';
  } catch (error) {
    console.error('❌ Exception fetching role color for role_id', roleId, ':', error);
    return '#6b7280'; // Default gray
  }
};

// Get all available permissions (mock data for now)
export const getAllPermissions = async () => {
  try {
    // Return mock permissions matching the new structure
    const mockPermissions = [
      { id: 1, name: 'dashboard:read', description: 'View dashboard', category: 'dashboard', created_at: new Date().toISOString() },
      { id: 2, name: 'companies:read', description: 'View companies', category: 'companies', created_at: new Date().toISOString() },
      { id: 3, name: 'companies:create', description: 'Create companies', category: 'companies', created_at: new Date().toISOString() },
      { id: 4, name: 'companies:update', description: 'Update companies', category: 'companies', created_at: new Date().toISOString() },
      { id: 5, name: 'companies:delete', description: 'Delete companies', category: 'companies', created_at: new Date().toISOString() },
      { id: 6, name: 'vans:read', description: 'View vans', category: 'vans', created_at: new Date().toISOString() },
      { id: 7, name: 'vans:create', description: 'Create vans', category: 'vans', created_at: new Date().toISOString() },
      { id: 8, name: 'vans:update', description: 'Update vans', category: 'vans', created_at: new Date().toISOString() },
      { id: 9, name: 'vans:delete', description: 'Delete vans', category: 'vans', created_at: new Date().toISOString() },
      { id: 10, name: 'users:read', description: 'View users', category: 'users', created_at: new Date().toISOString() },
      { id: 11, name: 'users:create', description: 'Create users', category: 'users', created_at: new Date().toISOString() },
      { id: 12, name: 'users:update', description: 'Update users', category: 'users', created_at: new Date().toISOString() },
      { id: 13, name: 'users:delete', description: 'Delete users', category: 'users', created_at: new Date().toISOString() },
      { id: 14, name: 'trips:read', description: 'View trips', category: 'trips', created_at: new Date().toISOString() },
      { id: 15, name: 'trips:create', description: 'Create trips', category: 'trips', created_at: new Date().toISOString() },
      { id: 16, name: 'trips:update', description: 'Update trips', category: 'trips', created_at: new Date().toISOString() },
      { id: 17, name: 'trips:delete', description: 'Delete trips', category: 'trips', created_at: new Date().toISOString() },
      { id: 18, name: 'auth-users:read', description: 'View auth users', category: 'auth-users', created_at: new Date().toISOString() },
      { id: 19, name: 'groups:read', description: 'View system groups', category: 'groups', created_at: new Date().toISOString() },
      { id: 20, name: 'groups:manage', description: 'Manage system groups', category: 'groups', created_at: new Date().toISOString() },
    ];

    return mockPermissions;
  } catch (error) {
    console.error('❌ Exception fetching all permissions:', error);
    return [];
  }
};

// Get permissions by category (mock implementation)
export const getPermissionsByCategory = async (category: string) => {
  try {
    const allPermissions = await getAllPermissions();
    return allPermissions.filter(p => p.category === category);
  } catch (error) {
    console.error('❌ Exception fetching permissions for category', category, ':', error);
    return [];
  }
};

// Legacy functions for backward compatibility
export const getPermissionsForRole = async (systemGroup: string): Promise<string[]> => {
  // Map legacy group names to role_id
  const roleIdMap: Record<string, number> = {
    'Administrator': 1,
    'Supervisor': 2,
    'Employee': 3
  };
  
  const roleId = roleIdMap[systemGroup] || 3;
  return getPermissionsForRoleId(roleId);
};

export const roleHasPermission = async (systemGroup: string, permission: string): Promise<boolean> => {
  const rolePermissions = await getPermissionsForRole(systemGroup);
  return rolePermissions.includes(permission);
};

export const getRoleDisplayName = async (systemGroup: string): Promise<string> => {
  const roleIdMap: Record<string, number> = {
    'Administrator': 1,
    'Supervisor': 2,
    'Employee': 3
  };
  
  const roleId = roleIdMap[systemGroup] || 3;
  return getRoleDisplayNameById(roleId);
};

export const getRoleColor = async (systemGroup: string): Promise<string> => {
  const roleIdMap: Record<string, number> = {
    'Administrator': 1,
    'Supervisor': 2,
    'Employee': 3
  };
  
  const roleId = roleIdMap[systemGroup] || 3;
  return getRoleColorById(roleId);
};

// Clear cache function for when groups are updated
export const clearPermissionsCache = () => {
  permissionsCache = {};
  cacheTimestamp = 0;
};
