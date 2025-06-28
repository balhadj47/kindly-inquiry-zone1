import { supabase } from '@/integrations/supabase/client';

// Cache for roles loaded from database
let rolesCache: Record<number, string> = {};
let roleColorsCache: Record<number, string> = {};
let cacheLoaded = false;

// Load roles from database into cache
export const loadRolesFromDatabase = async (): Promise<void> => {
  try {
    console.log('🔄 Loading roles from database...');
    
    const { data, error } = await supabase
      .from('user_groups')
      .select('role_id, name, color')
      .order('role_id', { ascending: true });

    if (error) {
      console.error('❌ Error loading roles from database:', error);
      // Clear cache on error instead of fallback
      rolesCache = {};
      roleColorsCache = {};
      cacheLoaded = false;
      return;
    }

    // Clear existing cache
    rolesCache = {};
    roleColorsCache = {};
    
    // Populate cache from database only
    data?.forEach(role => {
      if (role.role_id) {
        rolesCache[role.role_id] = role.name;
        roleColorsCache[role.role_id] = role.color || '#6b7280';
      }
    });

    cacheLoaded = true;
    console.log('✅ Roles loaded from database:', rolesCache);
  } catch (error) {
    console.error('❌ Exception loading roles from database:', error);
    // Clear cache on error
    rolesCache = {};
    roleColorsCache = {};
    cacheLoaded = false;
  }
};

// Initialize cache on module load
loadRolesFromDatabase();

// Convert role_id to role display name (synchronous after cache is loaded)
export const getRoleNameFromId = (roleId: number): string => {
  if (!cacheLoaded || !rolesCache[roleId]) {
    return `Role ${roleId}`;
  }
  
  return rolesCache[roleId];
};

// Get role color from role_id (synchronous after cache is loaded)
export const getRoleColorFromId = (roleId: number): string => {
  if (!cacheLoaded || !roleColorsCache[roleId]) {
    return '#6b7280'; // Gray default
  }
  
  return roleColorsCache[roleId];
};

// Get all available roles from cache
export const getAllRoles = (): Array<{ id: number; name: string; color: string }> => {
  if (!cacheLoaded) {
    return [];
  }
  
  return Object.keys(rolesCache).map(roleId => ({
    id: parseInt(roleId),
    name: rolesCache[parseInt(roleId)],
    color: roleColorsCache[parseInt(roleId)] || '#6b7280'
  }));
};

// Convert role_id to system group name for backward compatibility
export const getSystemGroupFromRoleId = (roleId: number): string => {
  return getRoleNameFromId(roleId);
};

// Check if role_id indicates a driver role - now based on database data
export const isDriverRole = (roleId: number): boolean => {
  // This should be determined by permissions in the database
  // For now, keeping simple logic but could be enhanced
  return roleId >= 2; // Non-admin roles can be drivers
};

// Check if role_id indicates admin privileges - now based on database data
export const isAdminRole = (roleId: number): boolean => {
  return roleId === 1; // Typically admin is role_id 1
};

// Check if role_id indicates supervisor privileges - now based on database data
export const isSupervisorRole = (roleId: number): boolean => {
  return roleId === 2; // Typically supervisor is role_id 2
};

// Check if role_id indicates employee level - now based on database data
export const isEmployeeRole = (roleId: number): boolean => {
  return roleId >= 3; // Employee level roles
};

// Force reload roles from database
export const reloadRolesFromDatabase = (): Promise<void> => {
  cacheLoaded = false;
  rolesCache = {};
  roleColorsCache = {};
  return loadRolesFromDatabase();
};
