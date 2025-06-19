
import { getRoleDisplayNameById, getRoleColorById } from './rolePermissions';

// Convert role_id to role display name
export const getRoleNameFromId = (roleId: number): string => {
  return getRoleDisplayNameById(roleId);
};

// Get role color from role_id
export const getRoleColorFromId = (roleId: number): string => {
  return getRoleColorById(roleId);
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
