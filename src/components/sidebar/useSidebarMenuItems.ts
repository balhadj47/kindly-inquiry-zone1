
import { MenuItem } from './types';
import { createMenuItems } from './menuConfig';
import { useSecurePermissions } from '@/hooks/useSecurePermissions';
import { useLanguage } from '@/contexts/LanguageContext';

export const useSidebarMenuItems = (): MenuItem[] => {
  console.log('🔍 useSidebarMenuItems: Starting secure menu generation');
  
  const permissions = useSecurePermissions();
  const { t } = useLanguage();

  console.log('🔍 Secure menu processing:', {
    isAuthenticated: permissions.isAuthenticated,
    isAdmin: permissions.isAdmin,
    timestamp: new Date().toISOString()
  });

  // If not authenticated, return empty menu
  if (!permissions.isAuthenticated) {
    console.log('🔍 No authenticated user, returning empty menu');
    return [];
  }

  // Get all menu items and filter based on secure permissions
  const allMenuItems = createMenuItems(t);
  
  const filteredMenuItems = allMenuItems.filter((item) => {
    try {
      let hasAccess = false;
      
      // Use secure permission helpers (database-backed)
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
          hasAccess = permissions.hasPermission(item.permission || '');
      }
      
      console.log(`🔍 Secure permission check for ${item.title}:`, {
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

  console.log('🔍 SECURE MENU RESULT:', {
    totalMenuItems: allMenuItems.length,
    filteredCount: filteredMenuItems.length,
    filteredTitles: filteredMenuItems.map(item => item.title)
  });
  
  return filteredMenuItems;
};
