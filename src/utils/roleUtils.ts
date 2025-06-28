
// Convert role_id to role display name using a mapping approach
export const getRoleNameFromId = (roleId: number): string => {
  switch (roleId) {
    case 1: return 'Administrator';
    case 2: return 'Supervisor';
    case 3: return 'Employee';
    default: return 'Employee';
  }
};

// Get role color from role_id using a mapping approach
export const getRoleColorFromId = (roleId: number): string => {
  switch (roleId) {
    case 1: return '#dc2626'; // Red for Administrator
    case 2: return '#ea580c'; // Orange for Supervisor  
    case 3: return '#059669'; // Green for Employee
    default: return '#6b7280'; // Gray default
  }
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
