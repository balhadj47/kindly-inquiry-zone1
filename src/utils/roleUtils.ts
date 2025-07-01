
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
      .maybeSingle(); // Use maybeSingle to handle no results gracefully

    if (error) {
      return `Role ${roleId}`;
    }

    if (!data) {
      return `Role ${roleId} (Not Found)`;
    }

    return data.name || `Role ${roleId}`;
  } catch (error) {
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
      return '#6b7280';
    }

    if (!data) {
      return '#6b7280';
    }

    return data.color || '#6b7280';
  } catch (error) {
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
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    const roles = data
      .filter(role => role.role_id !== null)
      .map(role => ({
        id: role.role_id!,
        name: role.name || `Role ${role.role_id}`,
        color: role.color || '#6b7280'
      }));

    return roles;
  } catch (error) {
    return [];
  }
};

// Simplified permission checking functions
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
    return false;
  }
};

export const isAdminRole = async (roleId: number): Promise<boolean> => {
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
    return permissionCount >= 10;
  } catch (error) {
    return false;
  }
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
    return permissionCount >= 5 && permissionCount < 10;
  } catch (error) {
    return false;
  }
};

export const isEmployeeRole = async (roleId: number): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_groups')
      .select('permissions')
      .eq('role_id', roleId)
      .maybeSingle();

    if (error || !data) {
      return true; // Default to employee
    }

    const permissionCount = data.permissions ? data.permissions.length : 0;
    return permissionCount < 5;
  } catch (error) {
    return true;
  }
};

// Legacy compatibility functions
export const getSystemGroupFromRoleId = getRoleNameFromId;
