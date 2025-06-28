
import { supabase } from '@/integrations/supabase/client';

// Simplified role utility functions with better error handling
export const getRoleNameFromId = async (roleId: number): Promise<string> => {
  try {
    console.log('🔍 getRoleNameFromId: Querying for role_id:', roleId);
    
    if (!roleId) {
      return 'Unknown Role';
    }
    
    const { data, error } = await supabase
      .from('user_groups')
      .select('name')
      .eq('role_id', roleId)
      .maybeSingle(); // Use maybeSingle to handle no results gracefully

    if (error) {
      console.error('❌ getRoleNameFromId: Database error:', error);
      return `Role ${roleId}`;
    }

    if (!data) {
      console.warn('⚠️ Role not found for role_id:', roleId);
      return `Role ${roleId} (Not Found)`;
    }

    console.log('✅ getRoleNameFromId: Found role name:', data.name);
    return data.name || `Role ${roleId}`;
  } catch (error) {
    console.error('❌ getRoleNameFromId: Exception:', error);
    return `Role ${roleId}`;
  }
};

export const getRoleColorFromId = async (roleId: number): Promise<string> => {
  try {
    console.log('🎨 getRoleColorFromId: Querying for role_id:', roleId);
    
    if (!roleId) {
      return '#6b7280';
    }
    
    const { data, error } = await supabase
      .from('user_groups')
      .select('color')
      .eq('role_id', roleId)
      .maybeSingle();

    if (error) {
      console.error('❌ getRoleColorFromId: Database error:', error);
      return '#6b7280';
    }

    if (!data) {
      console.warn('⚠️ Role color not found for role_id:', roleId);
      return '#6b7280';
    }

    console.log('✅ getRoleColorFromId: Found role color:', data.color);
    return data.color || '#6b7280';
  } catch (error) {
    console.error('❌ getRoleColorFromId: Exception:', error);
    return '#6b7280';
  }
};

export const getAllRoles = async (): Promise<Array<{ id: number; name: string; color: string }>> => {
  try {
    console.log('📋 getAllRoles: Loading all roles...');
    
    const { data, error } = await supabase
      .from('user_groups')
      .select('role_id, name, color')
      .order('role_id', { ascending: true });

    if (error) {
      console.error('❌ getAllRoles: Database error:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ getAllRoles: No roles found');
      return [];
    }

    const roles = data
      .filter(role => role.role_id !== null)
      .map(role => ({
        id: role.role_id!,
        name: role.name || `Role ${role.role_id}`,
        color: role.color || '#6b7280'
      }));

    console.log('✅ getAllRoles: Loaded roles:', roles.length);
    return roles;
  } catch (error) {
    console.error('❌ getAllRoles: Exception:', error);
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
    console.error('❌ isDriverRole: Error:', error);
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
    console.error('❌ isAdminRole: Error:', error);
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
    console.error('❌ isSupervisorRole: Error:', error);
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
    console.error('❌ isEmployeeRole: Error:', error);
    return true;
  }
};

// Legacy compatibility functions
export const getSystemGroupFromRoleId = getRoleNameFromId;
