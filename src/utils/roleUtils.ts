
import { supabase } from '@/integrations/supabase/client';

// Get role name by querying database directly (no cache)
export const getRoleNameFromId = async (roleId: number): Promise<string> => {
  try {
    console.log('🔍 getRoleNameFromId: Querying for role_id:', roleId);
    
    if (!roleId) {
      console.warn('⚠️ getRoleNameFromId: Invalid role_id:', roleId);
      return 'Unknown Role';
    }
    
    const { data, error } = await supabase
      .from('user_groups')
      .select('name')
      .eq('role_id', roleId)
      .single();

    if (error) {
      console.error('❌ getRoleNameFromId: Database error:', error);
      if (error.code === 'PGRST116') {
        console.warn('⚠️ Role not found for role_id:', roleId);
        return `Role ${roleId} (Not Found)`;
      }
      return `Role ${roleId}`;
    }

    if (!data) {
      console.warn('⚠️ getRoleNameFromId: No data found for role_id:', roleId);
      return `Role ${roleId} (Missing)`;
    }

    console.log('✅ getRoleNameFromId: Found role name:', data.name, 'for role_id:', roleId);
    return data.name || `Role ${roleId}`;
  } catch (error) {
    console.error('❌ getRoleNameFromId: Exception:', error);
    return `Role ${roleId}`;
  }
};

// Get role color by querying database directly (no cache)
export const getRoleColorFromId = async (roleId: number): Promise<string> => {
  try {
    console.log('🎨 getRoleColorFromId: Querying for role_id:', roleId);
    
    if (!roleId) {
      console.warn('⚠️ getRoleColorFromId: Invalid role_id:', roleId);
      return '#6b7280';
    }
    
    const { data, error } = await supabase
      .from('user_groups')
      .select('color')
      .eq('role_id', roleId)
      .single();

    if (error) {
      console.error('❌ getRoleColorFromId: Database error:', error);
      if (error.code === 'PGRST116') {
        console.warn('⚠️ Role color not found for role_id:', roleId);
        return '#6b7280';
      }
      return '#6b7280';
    }

    if (!data) {
      console.warn('⚠️ getRoleColorFromId: No data found for role_id:', roleId);
      return '#6b7280';
    }

    console.log('✅ getRoleColorFromId: Found role color:', data.color, 'for role_id:', roleId);
    return data.color || '#6b7280';
  } catch (error) {
    console.error('❌ getRoleColorFromId: Exception:', error);
    return '#6b7280';
  }
};

// Get all available roles from database directly (no cache)
export const getAllRoles = async (): Promise<Array<{ id: number; name: string; color: string }>> => {
  try {
    console.log('📋 getAllRoles: Loading all roles from database...');
    
    const { data, error } = await supabase
      .from('user_groups')
      .select('role_id, name, color')
      .order('role_id', { ascending: true });

    if (error) {
      console.error('❌ getAllRoles: Database error:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ getAllRoles: No roles found in database');
      return [];
    }

    const roles = data
      .filter(role => role.role_id !== null && role.role_id !== undefined)
      .map(role => ({
        id: role.role_id!,
        name: role.name || `Role ${role.role_id}`,
        color: role.color || '#6b7280'
      }));

    console.log('✅ getAllRoles: Loaded roles from database:', roles);
    return roles;
  } catch (error) {
    console.error('❌ getAllRoles: Exception:', error);
    return [];
  }
};

// Convert role_id to system group name for backward compatibility
export const getSystemGroupFromRoleId = async (roleId: number): Promise<string> => {
  return await getRoleNameFromId(roleId);
};

// Check if role_id indicates a driver role - based on permission analysis
export const isDriverRole = async (roleId: number): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_groups')
      .select('permissions')
      .eq('role_id', roleId)
      .single();

    if (error || !data) {
      console.error('❌ isDriverRole: Error fetching role permissions:', error);
      return false;
    }

    // Check if role has driving-related permissions
    const permissions = data.permissions || [];
    const hasDrivingPermissions = permissions.some((perm: string) => 
      perm.includes('trips') || perm.includes('vans') || perm.includes('drive')
    );

    console.log('🚗 isDriverRole: Analysis for role_id', roleId, ':', {
      permissions,
      hasDrivingPermissions
    });

    return hasDrivingPermissions;
  } catch (error) {
    console.error('❌ isDriverRole: Error:', error);
    return false;
  }
};

// Check if role_id indicates admin privileges - based on permission count
export const isAdminRole = async (roleId: number): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_groups')
      .select('permissions')
      .eq('role_id', roleId)
      .single();

    if (error || !data) {
      console.error('❌ isAdminRole: Error fetching role permissions:', error);
      return false;
    }

    // Admin roles typically have many permissions (10+)
    const permissionCount = data.permissions ? data.permissions.length : 0;
    const isAdmin = permissionCount >= 10;

    console.log('👑 isAdminRole: Analysis for role_id', roleId, ':', {
      permissionCount,
      isAdmin
    });

    return isAdmin;
  } catch (error) {
    console.error('❌ isAdminRole: Error:', error);
    return false;
  }
};

// Check if role_id indicates supervisor privileges - based on permission count
export const isSupervisorRole = async (roleId: number): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_groups')
      .select('permissions')
      .eq('role_id', roleId)
      .single();

    if (error || !data) {
      console.error('❌ isSupervisorRole: Error fetching role permissions:', error);
      return false;
    }

    // Supervisor roles typically have moderate permissions (5-9)
    const permissionCount = data.permissions ? data.permissions.length : 0;
    const isSupervisor = permissionCount >= 5 && permissionCount < 10;

    console.log('👔 isSupervisorRole: Analysis for role_id', roleId, ':', {
      permissionCount,
      isSupervisor
    });

    return isSupervisor;
  } catch (error) {
    console.error('❌ isSupervisorRole: Error:', error);
    return false;
  }
};

// Check if role_id indicates employee level - based on permission count
export const isEmployeeRole = async (roleId: number): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_groups')
      .select('permissions')
      .eq('role_id', roleId)
      .single();

    if (error || !data) {
      console.error('❌ isEmployeeRole: Error fetching role permissions:', error);
      return true; // Default to employee if error
    }

    // Employee roles typically have few permissions (< 5)
    const permissionCount = data.permissions ? data.permissions.length : 0;
    const isEmployee = permissionCount < 5;

    console.log('👷 isEmployeeRole: Analysis for role_id', roleId, ':', {
      permissionCount,
      isEmployee
    });

    return isEmployee;
  } catch (error) {
    console.error('❌ isEmployeeRole: Error:', error);
    return true; // Default to employee if error
  }
};
