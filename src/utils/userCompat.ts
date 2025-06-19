
import { User } from '@/types/rbac';
import { getRoleNameFromId } from './roleUtils';

// Convert User to display format
export const getUserDisplayInfo = (user: User) => {
  return {
    ...user,
    roleName: getRoleNameFromId(user.role_id),
    displayName: user.name,
    statusBadgeColor: getStatusBadgeColor(user.status),
  };
};

const getStatusBadgeColor = (status: User['status']): string => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800';
    case 'Inactive':
      return 'bg-gray-100 text-gray-800';
    case 'Suspended':
      return 'bg-red-100 text-red-800';
    case 'Récupération':
      return 'bg-blue-100 text-blue-800';
    case 'Congé':
      return 'bg-yellow-100 text-yellow-800';
    case 'Congé maladie':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Helper function to check if user can perform actions
export const canUserPerformAction = (user: User, action: string): boolean => {
  // Admin can do everything
  if (user.role_id === 1) return true;
  
  // Supervisor can manage employees
  if (user.role_id === 2 && action.includes('employee')) return true;
  
  // Basic permissions for employees
  return false;
};
