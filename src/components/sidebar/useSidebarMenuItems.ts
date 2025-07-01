
import { MenuItem } from './types';
import { createMenuItems } from './menuConfig';
import { useSecurePermissions } from '@/hooks/useSecurePermissions';
import { useLanguage } from '@/contexts/LanguageContext';

export const useSidebarMenuItems = (): MenuItem[] => {
  const permissions = useSecurePermissions();
  const { t } = useLanguage();

  // If not authenticated, return empty menu
  if (!permissions.isAuthenticated) {
    return [];
  }

  // Get all menu items and filter based on secure permissions
  const allMenuItems = createMenuItems(t);
  
  const filteredMenuItems = allMenuItems.filter((item) => {
    if (!item.permission) {
      return true;
    }

    // Use the hasPermission function which checks database permissions
    const hasAccess = permissions.hasPermission(item.permission);
    
    return hasAccess;
  });

  return filteredMenuItems;
};
