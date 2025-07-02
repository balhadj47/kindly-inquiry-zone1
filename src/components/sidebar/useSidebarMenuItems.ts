
import { MenuItem } from './types';
import { createMenuItems } from './menuConfig';
import { useSecurePermissions } from '@/hooks/useSecurePermissions';
import { useLanguage } from '@/contexts/LanguageContext';

export const useSidebarMenuItems = (): MenuItem[] => {
  const permissions = useSecurePermissions();
  const { t } = useLanguage();

  // If not authenticated, return empty menu
  if (!permissions.isAuthenticated) {
    console.log('🔍 useSidebarMenuItems: Not authenticated, returning empty menu');
    return [];
  }

  // Get all menu items and filter based on secure permissions
  const allMenuItems = createMenuItems(t);
  
  const filteredMenuItems = allMenuItems.filter((item) => {
    if (!item.permission) {
      console.log(`🔍 useSidebarMenuItems: Including ${item.title} - no permission required`);
      return true;
    }

    // Use the hasPermission function which checks database permissions
    const hasAccess = permissions.hasPermission(item.permission);
    
    console.log(`🔍 useSidebarMenuItems: ${item.title} (${item.permission}) = ${hasAccess}`, {
      isAdmin: permissions.isAdmin,
      currentUserRole: permissions.currentUser?.role_id
    });
    
    return hasAccess;
  });

  console.log('🔍 useSidebarMenuItems: Final filtered menu items:', filteredMenuItems.map(item => item.title));
  return filteredMenuItems;
};
