
import { MenuItem } from './types';
import { createMenuItems } from './menuConfig';
import { useContextAccess } from './useContextAccess';
import { usePermissionCheck } from './usePermissionCheck';

export const useSidebarMenuItems = (): MenuItem[] => {
  console.log('🔍 useSidebarMenuItems: Starting hook execution');
  
  const { hasPermission, currentUser, loading, roles, t } = useContextAccess();
  const { checkItemPermission } = usePermissionCheck(hasPermission);

  console.log('🔍 Menu items processing:', {
    userId: currentUser?.id || 'null',
    userEmail: currentUser?.email || 'null',
    roleId: currentUser?.role_id || 'null',
    loading: loading,
    rolesCount: roles?.length || 0,
    hasPermissionFunction: typeof hasPermission === 'function'
  });

  // If still loading, return empty array to avoid flashing unauthorized menu items
  if (loading) {
    console.log('🔍 RBAC context still loading, returning empty menu');
    return [];
  }

  // If no user is logged in, return empty menu
  if (!currentUser) {
    console.log('🔍 No current user, returning empty menu');
    return [];
  }

  // If no roles are loaded yet, return empty menu to prevent showing unauthorized items
  if (!roles || roles.length === 0) {
    console.log('🔍 No roles loaded yet, returning empty menu');
    return [];
  }

  // Get all menu items and filter based on permissions
  const allMenuItems = createMenuItems(t);
  
  const filteredMenuItems = allMenuItems.filter((item) => {
    try {
      const hasAccess = checkItemPermission(item.permission);
      
      console.log(`🔍 Permission check for ${item.title}:`, {
        permission: item.permission,
        hasPermission: hasAccess,
        href: item.href
      });
      
      return hasAccess;
    } catch (error) {
      console.error(`🔍 Error checking permission for ${item.title}:`, error?.message || 'Unknown error');
      return false;
    }
  });

  console.log('🔍 FINAL RESULT:', {
    totalMenuItems: allMenuItems.length,
    filteredCount: filteredMenuItems.length,
    filteredTitles: filteredMenuItems.map(item => item.title),
    hasAuthUsers: filteredMenuItems.some(item => item.href === '/auth-users'),
    hasVans: filteredMenuItems.some(item => item.href === '/vans'),
    hasCompanies: filteredMenuItems.some(item => item.href === '/companies'),
    hasUsers: filteredMenuItems.some(item => item.href === '/employees'),
    hasMissions: filteredMenuItems.some(item => item.href === '/missions')
  });
  
  return filteredMenuItems;
};
