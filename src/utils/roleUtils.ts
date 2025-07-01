
import { supabase } from '@/integrations/supabase/client';

// Simplified role utility functions with better error handling
export const getRoleNameFromId = async (roleId: number): Promise<string> => {
  try {
    if (!roleId) {
      return 'Unknown Role';
    }
    
    const { data, error } = await supabase
      .from('user_groups')
      .select('name')
      .eq('role_id', roleId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching role name:', error);
      return getRoleNameFallback(roleId);
    }

    if (!data) {
      return getRoleNameFallback(roleId);
    }

    return data.name || getRoleNameFallback(roleId);
  } catch (error) {
    console.error('Exception fetching role name:', error);
    return getRoleNameFallback(roleId);
  }
};

// Fallback role names
const getRoleNameFallback = (roleId: number): string => {
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

export const getRoleColorFromId = async (roleId: number): Promise<string> => {
  try {
    if (!roleId) {
      return '#6b7280';
    }
    
    const { data, error } = await supabase
      .from('user_groups')
      .select('color')
      .eq('role_id', roleId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching role color:', error);
      return getRoleColorFallback(roleId);
    }

    if (!data) {
      return getRoleColorFallback(roleId);
    }

    return data.color || getRoleColorFallback(roleId);
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

export const getAllRoles = async (): Promise<Array<{ id: number; name: string; color: string }>> => {
  try {
    const { data, error } = await supabase
      .from('user_groups')
      .select('role_id, name, color')
      .order('role_id', { ascending: true });

    if (error) {
      console.error('Error fetching all roles:', error);
      return getDefaultRoles();
    }

    if (!data || data.length === 0) {
      return getDefaultRoles();
    }

    const roles = data
      .filter(role => role.role_id !== null)
      .map(role => ({
        id: role.role_id!,
        name: role.name || getRoleNameFallback(role.role_id!),
        color: role.color || getRoleColorFallback(role.role_id!)
      }));

    return roles;
  } catch (error) {
    console.error('Exception fetching all roles:', error);
    return getDefaultRoles();
  }
};

// Default roles fallback
const getDefaultRoles = (): Array<{ id: number; name: string; color: string }> => {
  return [
    { id: 1, name: 'Administrator', color: '#dc2626' },
    { id: 2, name: 'Viewer', color: '#6b7280' },
    { id: 3, name: 'Employee', color: '#059669' }
  ];
};

// Role type checking functions
export const isViewOnlyRole = (roleId: number): boolean => {
  return roleId === 2;
};

export const isDriverRole = async (roleId: number): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_groups')
      .select('permissions')
      .eq('role_id', roleId)
      .maybeSingle();

    if (error || !data) {
      return false;
    }

    const permissions = data.permissions || [];
    return permissions.some((perm: string) => 
      perm.includes('trips') || perm.includes('vans')
    );
  } catch (error) {
    console.error('Exception checking driver role:', error);
    return false;
  }
};

export const isAdminRole = async (roleId: number): Promise<boolean> => {
  return roleId === 1;
};

export const isSupervisorRole = async (roleId: number): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_groups')
      .select('permissions')
      .eq('role_id', roleId)
      .maybeSingle();

    if (error || !data) {
      return false;
    }

    const permissionCount = data.permissions ? data.permissions.length : 0;
    return permissionCount >= 5 && permissionCount < 10 && roleId !== 1;
  } catch (error) {
    console.error('Exception checking supervisor role:', error);
    return false;
  }
};

export const isEmployeeRole = async (roleId: number): Promise<boolean> => {
  return roleId === 3;
};

// Legacy compatibility functions
export const getSystemGroupFromRoleId = getRoleNameFromId;
