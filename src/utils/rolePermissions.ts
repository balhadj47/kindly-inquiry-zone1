
import { supabase } from '@/integrations/supabase/client';

// Cache for permissions to avoid repeated database calls
let permissionsCache: Record<number, string[]> = {};
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to get permissions for a role_id using the new normalized structure
export const getPermissionsForRoleId = async (roleId: number): Promise<string[]> => {
  console.log('🔐 getPermissionsForRoleId called with roleId:', roleId);
  
  // Check cache first
  const now = Date.now();
  if (permissionsCache[roleId] && (now - cacheTimestamp < CACHE_DURATION)) {
    console.log('🔐 Using cached permissions for role_id', roleId);
    return permissionsCache[roleId];
  }

  try {
    // Use the new normalized structure via database function
    const { data, error } = await supabase.rpc('get_role_permissions', {
      role_id_param: roleId
    });

    if (error) {
      console.error('❌ Error fetching permissions for role_id', roleId, ':', error);
      return ['dashboard:read']; // Default fallback
    }

    const permissions = data?.map((row: any) => row.permission_name) || ['dashboard:read'];
    
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

// Check if a role_id has a specific permission using the new structure
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

// Get all available permissions with categories
export const getAllPermissions = async () => {
  try {
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .order('category')
      .order('name');

    if (error) {
      console.error('❌ Error fetching all permissions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('❌ Exception fetching all permissions:', error);
    return [];
  }
};

// Get permissions by category
export const getPermissionsByCategory = async (category: string) => {
  try {
    const { data, error } = await supabase.rpc('get_permissions_by_category', {
      category_name: category
    });

    if (error) {
      console.error('❌ Error fetching permissions for category', category, ':', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('❌ Exception fetching permissions for category', category, ':', error);
    return [];
  }
};

// Legacy functions for backward compatibility (now using new structure)
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
