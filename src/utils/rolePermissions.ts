
import { supabase } from '@/integrations/supabase/client';

// Helper function to get permissions for a role_id using secure database functions
export const getPermissionsForRoleId = async (roleId: number): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('user_groups')
      .select('permissions')
      .eq('role_id', roleId)
      .single();

    if (error) {
      console.error('Error fetching permissions for role:', roleId, error);
      return ['dashboard:read'];
    }

    const permissions = Array.isArray(data?.permissions) ? data.permissions : ['dashboard:read'];
    return permissions;
  } catch (error) {
    console.error('Exception fetching permissions for role:', roleId, error);
    return ['dashboard:read'];
  }
};

// Check if a role_id has a specific permission using secure functions
export const roleIdHasPermission = async (roleId: number, permission: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('current_user_has_permission', {
      permission_name: permission
    });

    if (error) {
      const rolePermissions = await getPermissionsForRoleId(roleId);
      return rolePermissions.includes(permission);
    }

    return data === true;
  } catch (error) {
    const rolePermissions = await getPermissionsForRoleId(roleId);
    return rolePermissions.includes(permission);
  }
};

// Helper function to check if role is view-only
export const isViewOnlyRole = (roleId: number): boolean => {
  return roleId === 2;
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
      console.error('Error fetching role name:', error);
      return getRoleDisplayNameFallback(roleId);
    }

    return data?.name || getRoleDisplayNameFallback(roleId);
  } catch (error) {
    console.error('Exception fetching role name:', error);
    return getRoleDisplayNameFallback(roleId);
  }
};

// Fallback role names for consistency
const getRoleDisplayNameFallback = (roleId: number): string => {
  switch (roleId) {
    case 1:
      return 'Administrator';
    case 2:
      return 'Viewer';
    case 3:
      return 'Employee';
    default:
      return `Role ${roleId}`;
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
      console.error('Error fetching role color:', error);
      return getRoleColorFallback(roleId);
    }

    return data?.color || getRoleColorFallback(roleId);
  } catch (error) {
    console.error('Exception fetching role color:', error);
    return getRoleColorFallback(roleId);
  }
};

// Fallback role colors
const getRoleColorFallback = (roleId: number): string => {
  switch (roleId) {
    case 1:
      return '#dc2626'; // Red for admin
    case 2:
      return '#6b7280'; // Gray for viewer
    case 3:
      return '#059669'; // Green for employee
    default:
      return '#6b7280';
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
      console.error('Error fetching all permissions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Exception fetching all permissions:', error);
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
      console.error('Error fetching permissions by category:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Exception fetching permissions by category:', error);
    return [];
  }
};

// Legacy functions for backward compatibility
export const getPermissionsForRole = async (systemGroup: string): Promise<string[]> => {
  const roleIdMap: Record<string, number> = {
    'Administrator': 1,
    'Viewer': 2,
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
    'Viewer': 2,
    'Employee': 3
  };
  
  const roleId = roleIdMap[systemGroup] || 3;
  return getRoleDisplayNameById(roleId);
};

export const getRoleColor = async (systemGroup: string): Promise<string> => {
  const roleIdMap: Record<string, number> = {
    'Administrator': 1,
    'Viewer': 2,
    'Employee': 3
  };
  
  const roleId = roleIdMap[systemGroup] || 3;
  return getRoleColorById(roleId);
};
