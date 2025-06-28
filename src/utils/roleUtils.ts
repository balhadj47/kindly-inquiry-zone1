
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
      // Fallback to hardcoded values
      rolesCache = {
        1: 'Administrator',
        2: 'Supervisor', 
        3: 'Employee'
      };
      roleColorsCache = {
        1: '#dc2626',
        2: '#ea580c',
        3: '#059669'
      };
      return;
    }

    // Clear existing cache
    rolesCache = {};
    roleColorsCache = {};
    
    // Populate cache from database
    data?.forEach(role => {
      if (role.role_id) {
        rolesCache[role.role_id] = role.name;
        roleColorsCache[role.role_id] = role.color;
      }
    });

    // Ensure we have at least the basic roles
    if (!rolesCache[1]) rolesCache[1] = 'Administrator';
    if (!rolesCache[2]) rolesCache[2] = 'Supervisor';
    if (!rolesCache[3]) rolesCache[3] = 'Employee';
    
    if (!roleColorsCache[1]) roleColorsCache[1] = '#dc2626';
    if (!roleColorsCache[2]) roleColorsCache[2] = '#ea580c';
    if (!roleColorsCache[3]) roleColorsCache[3] = '#059669';

    cacheLoaded = true;
    console.log('✅ Roles loaded from database:', rolesCache);
  } catch (error) {
    console.error('❌ Exception loading roles from database:', error);
    // Fallback to hardcoded values
    rolesCache = {
      1: 'Administrator',
      2: 'Supervisor',
      3: 'Employee'
    };
    roleColorsCache = {
      1: '#dc2626',
      2: '#ea580c', 
      3: '#059669'
    };
  }
};

// Initialize cache on module load
loadRolesFromDatabase();

// Convert role_id to role display name (synchronous after cache is loaded)
export const getRoleNameFromId = (roleId: number): string => {
  if (!cacheLoaded) {
    // If cache not loaded yet, return fallback
    switch (roleId) {
      case 1: return 'Administrator';
      case 2: return 'Supervisor';
      case 3: return 'Employee';
      default: return 'Employee';
    }
  }
  
  return rolesCache[roleId] || 'Employee';
};

// Get role color from role_id (synchronous after cache is loaded)
export const getRoleColorFromId = (roleId: number): string => {
  if (!cacheLoaded) {
    // If cache not loaded yet, return fallback
    switch (roleId) {
      case 1: return '#dc2626'; // Red for Administrator
      case 2: return '#ea580c'; // Orange for Supervisor  
      case 3: return '#059669'; // Green for Employee
      default: return '#6b7280'; // Gray default
    }
  }
  
  return roleColorsCache[roleId] || '#6b7280';
};

// Get all available roles from cache
export const getAllRoles = (): Array<{ id: number; name: string; color: string }> => {
  return Object.keys(rolesCache).map(roleId => ({
    id: parseInt(roleId),
    name: rolesCache[parseInt(roleId)],
    color: roleColorsCache[parseInt(roleId)]
  }));
};

// Convert role_id to system group name for backward compatibility
export const getSystemGroupFromRoleId = (roleId: number): string => {
  return getRoleNameFromId(roleId);
};

// Check if role_id indicates a driver role
export const isDriverRole = (roleId: number): boolean => {
  // Employees (3) and Supervisors (2) can be drivers
  return roleId === 2 || roleId === 3;
};

// Check if role_id indicates admin privileges
export const isAdminRole = (roleId: number): boolean => {
  return roleId === 1;
};

// Check if role_id indicates supervisor privileges
export const isSupervisorRole = (roleId: number): boolean => {
  return roleId === 2;
};

// Check if role_id indicates employee level
export const isEmployeeRole = (roleId: number): boolean => {
  return roleId === 3;
};

// Force reload roles from database
export const reloadRolesFromDatabase = (): Promise<void> => {
  cacheLoaded = false;
  return loadRolesFromDatabase();
};
