
import { MenuItem } from './types';
import { createMenuItems } from './menuConfig';
import { usePermissions } from '@/hooks/usePermissions';
import { useLanguage } from '@/contexts/LanguageContext';

export const useSidebarMenuItems = (): MenuItem[] => {
  console.log('🔍 useSidebarMenuItems: Starting hook execution');
  
  const permissions = usePermissions();
  const { t } = useLanguage();

  console.log('🔍 Menu items processing:', {
    isAuthenticated: permissions.isAuthenticated,
    isHighPrivilegeUser: permissions.isHighPrivilegeUser,
    timestamp: new Date().toISOString()
  });

  // If not authenticated, return empty menu
  if (!permissions.isAuthenticated) {
    console.log('🔍 No authenticated user, returning empty menu');
    return [];
  }

  // Get all menu items and filter based on permissions
  const allMenuItems = createMenuItems(t);
  
  const filteredMenuItems = allMenuItems.filter((item) => {
    try {
      let hasAccess = false;
      
      // Map menu permissions to our permission helpers
      switch (item.permission) {
        case 'dashboard:read':
          hasAccess = permissions.canAccessDashboard;
          break;
        case 'companies:read':
          hasAccess = permissions.canReadCompanies;
          break;
        case 'vans:read':
          hasAccess = permissions.canReadVans;
          break;
        case 'users:read':
          hasAccess = permissions.canReadUsers;
          break;
        case 'trips:read':
          hasAccess = permissions.canReadTrips;
          break;
        case 'auth-users:read':
          hasAccess = permissions.canReadAuthUsers;
          break;
        default:
          hasAccess = permissions.checkPermission(item.permission || '');
      }
      
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
    filteredTitles: filteredMenuItems.map(item => item.title)
  });
  
  return filteredMenuItems;
};
