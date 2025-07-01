
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
    userPermissions: permissions.userPermissions || [],
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
    if (!item.permission) {
      console.log(`🔍 Menu item ${item.title} has no permission requirement - including by default`);
      return true;
    }

    // Use the hasPermission function which checks database permissions
    const hasAccess = permissions.hasPermission(item.permission);
    
    console.log(`🔍 Permission check for ${item.title}:`, {
      permission: item.permission,
      hasPermission: hasAccess,
      href: item.href
    });
    
    return hasAccess;
  });

  console.log('🔍 SECURE MENU RESULT:', {
    totalMenuItems: allMenuItems.length,
    filteredCount: filteredMenuItems.length,
    filteredTitles: filteredMenuItems.map(item => item.title),
    userPermissions: permissions.userPermissions || []
  });
  
  return filteredMenuItems;
};
