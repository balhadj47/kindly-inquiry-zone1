
import { useRBAC } from '@/contexts/RBACContext';
import { useLocation } from 'react-router-dom';

export const usePagePermissions = () => {
  const { currentUser, roles, hasPermission } = useRBAC();
  const location = useLocation();

  // Get current user's role
  const currentRole = roles.find(role => role.role_id === currentUser?.role_id);
  
  // Get accessible pages for current role
  const accessiblePages = currentRole?.accessiblePages || [];
  
  // Check if current page is accessible
  const isCurrentPageAccessible = accessiblePages.includes(location.pathname) || 
    hasPermission('*') || // Admin wildcard permission
    location.pathname === '/' || // Root always accessible
    location.pathname === '/auth'; // Auth page always accessible

  // Get all permissions for current role
  const currentPermissions = currentRole?.permissions || [];

  console.log('🔐 usePagePermissions:', {
    currentPath: location.pathname,
    userRoleId: currentUser?.role_id,
    roleName: currentRole?.name,
    accessiblePages,
    isCurrentPageAccessible,
    currentPermissions
  });

  return {
    currentRole,
    accessiblePages,
    isCurrentPageAccessible,
    currentPermissions,
    hasAccess: (permission: string) => hasPermission(permission),
  };
};
