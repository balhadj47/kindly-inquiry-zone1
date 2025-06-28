
import { supabase } from '@/integrations/supabase/client';

// Get role name by querying database directly (no cache)
export const getRoleNameFromId = async (roleId: number): Promise<string> => {
  try {
    console.log('🔍 getRoleNameFromId: Querying for role_id:', roleId);
    
    const { data, error } = await supabase
      .from('user_groups')
      .select('name')
      .eq('role_id', roleId)
      .single();

    if (error) {
      console.error('❌ getRoleNameFromId: Database error:', error);
      return `Role ${roleId}`;
    }

    if (!data) {
      console.warn('⚠️ getRoleNameFromId: No data found for role_id:', roleId);
      return `Role ${roleId}`;
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
    
    const { data, error } = await supabase
      .from('user_groups')
      .select('color')
      .eq('role_id', roleId)
      .single();

    if (error) {
      console.error('❌ getRoleColorFromId: Database error:', error);
      return '#6b7280'; // Gray default
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
      .filter(role => role.role_id !== null)
      .map(role => ({
        id: role.role_id!,
        name: role.name,
        color: role.color || '#6b7280'
      }));

    console.log('✅ getAllRoles: Loaded roles:', roles);
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

// Check if role_id indicates a driver role - based on database data
export const isDriverRole = async (roleId: number): Promise<boolean> => {
  // This should be determined by permissions in the database
  // For now, keeping simple logic but could be enhanced
  return roleId >= 2; // Non-admin roles can be drivers
};

// Check if role_id indicates admin privileges - based on database data
export const isAdminRole = async (roleId: number): Promise<boolean> => {
  return roleId === 1; // Typically admin is role_id 1
};

// Check if role_id indicates supervisor privileges - based on database data
export const isSupervisorRole = async (roleId: number): Promise<boolean> => {
  return roleId === 2; // Typically supervisor is role_id 2
};

// Check if role_id indicates employee level - based on database data
export const isEmployeeRole = async (roleId: number): Promise<boolean> => {
  return roleId >= 3; // Employee level roles
};

// Remove all caching - everything is fetched fresh from database
export const loadRolesFromDatabase = async (): Promise<void> => {
  // This function is no longer needed since we fetch directly each time
  console.log('ℹ️ loadRolesFromDatabase called but no longer caching - roles fetched directly from DB');
};

export const reloadRolesFromDatabase = async (): Promise<void> => {
  // This function is no longer needed since we don't cache
  console.log('ℹ️ reloadRolesFromDatabase called but no longer needed - roles always fresh from DB');
};
