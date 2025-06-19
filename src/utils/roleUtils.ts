
import { getRoleDisplayNameById } from './rolePermissions';

// Convert role_id to role display name
export const getRoleNameFromId = (roleId: number): string => {
  return getRoleDisplayNameById(roleId);
};

// Convert role_id to system group name for backward compatibility
export const getSystemGroupFromRoleId = (roleId: number): string => {
  switch (roleId) {
    case 1: return 'Administrator';
    case 2: return 'Supervisor';
    case 3: return 'Employee';
    default: return 'Employee';
  }
};

// Check if role_id indicates a driver role
export const isDriverRole = (roleId: number): boolean => {
  // For now, only specific roles can be drivers
  // This can be expanded based on business logic
  return roleId === 2 || roleId === 3; // Supervisor or Employee can be drivers
};
