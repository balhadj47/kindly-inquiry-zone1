
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

// Check if role_id indicates a driver role - based on database data
export const isDriverRole = async (roleId: number): Promise<boolean> => {
  try {
    const roleName = await getRoleNameFromId(roleId);
    // Check if the role name contains driver-related keywords
    const driverKeywords = ['driver', 'chauffeur', 'conducteur'];
    return driverKeywords.some(keyword => 
      roleName.toLowerCase().includes(keyword.toLowerCase())
    );
  } catch (error) {
    console.error('❌ isDriverRole: Error:', error);
    return false;
  }
};

// Check if role_id indicates admin privileges - based on database data
export const isAdminRole = async (roleId: number): Promise<boolean> => {
  try {
    const roleName = await getRoleNameFromId(roleId);
    // Check if the role name contains admin-related keywords
    const adminKeywords = ['admin', 'administrator', 'administrateur'];
    return adminKeywords.some(keyword => 
      roleName.toLowerCase().includes(keyword.toLowerCase())
    );
  } catch (error) {
    console.error('❌ isAdminRole: Error:', error);
    return false;
  }
};

// Check if role_id indicates supervisor privileges - based on database data
export const isSupervisorRole = async (roleId: number): Promise<boolean> => {
  try {
    const roleName = await getRoleNameFromId(roleId);
    // Check if the role name contains supervisor-related keywords
    const supervisorKeywords = ['supervisor', 'superviseur', 'manager', 'chef'];
    return supervisorKeywords.some(keyword => 
      roleName.toLowerCase().includes(keyword.toLowerCase())
    );
  } catch (error) {
    console.error('❌ isSupervisorRole: Error:', error);
    return false;
  }
};

// Check if role_id indicates employee level - based on database data
export const isEmployeeRole = async (roleId: number): Promise<boolean> => {
  try {
    const roleName = await getRoleNameFromId(roleId);
    // Check if the role name contains employee-related keywords or is not admin/supervisor
    const employeeKeywords = ['employee', 'employe', 'worker', 'staff'];
    const isEmployee = employeeKeywords.some(keyword => 
      roleName.toLowerCase().includes(keyword.toLowerCase())
    );
    
    // If not explicitly an employee, check if it's not admin or supervisor
    if (!isEmployee) {
      const isAdmin = await isAdminRole(roleId);
      const isSupervisor = await isSupervisorRole(roleId);
      return !isAdmin && !isSupervisor;
    }
    
    return isEmployee;
  } catch (error) {
    console.error('❌ isEmployeeRole: Error:', error);
    return true; // Default to employee if error
  }
};
