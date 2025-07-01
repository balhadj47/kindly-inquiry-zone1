
import { supabase } from '@/integrations/supabase/client';

// Cache for permissions to avoid repeated database calls
let permissionsCache: Record<number, string[]> = {};
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to get permissions for a role_id using secure database functions
export const getPermissionsForRoleId = async (roleId: number): Promise<string[]> => {
  console.log('🔐 getPermissionsForRoleId called with roleId:', roleId);
  
  // Check cache first
  const now = Date.now();
  if (permissionsCache[roleId] && (now - cacheTimestamp < CACHE_DURATION)) {
    console.log('🔐 Using cached permissions for role_id', roleId);
    return permissionsCache[roleId];
  }

  try {
    // Get permissions from the user_groups table (simplified approach)
    const { data, error } = await supabase
      .from('user_groups')
      .select('permissions')
      .eq('role_id', roleId)
      .single();

    if (error) {
      console.error('❌ Error fetching permissions for role_id', roleId, ':', error);
      return ['dashboard:read']; // Default fallback
    }

    // Use the permissions array directly
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

// Check if a role_id has a specific permission using secure functions
export const roleIdHasPermission = async (roleId: number, permission: string): Promise<boolean> => {
  console.log('🔐 roleIdHasPermission called with roleId:', roleId, 'permission:', permission);
  
  try {
    // Use the database function for permission checking
    const { data, error } = await supabase.rpc('current_user_has_permission', {
      permission_name: permission
    });

    if (error) {
      console.error('❌ Database permission check failed:', error);
      // Fallback to local permission check
      const rolePermissions = await getPermissionsForRoleId(roleId);
      return rolePermissions.includes(permission);
    }

    return data === true;
  } catch (error) {
    console.error('❌ Exception in roleIdHasPermission:', error);
    // Fallback to local permission check
    const rolePermissions = await getPermissionsForRoleId(roleId);
    return rolePermissions.includes(permission);
  }
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

// Get all available permissions using secure database access
export const getAllPermissions = async () => {
  try {
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('❌ Error fetching permissions:', error);
      // Return empty array if no access
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
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .eq('category', category)
      .order('name', { ascending: true });

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
