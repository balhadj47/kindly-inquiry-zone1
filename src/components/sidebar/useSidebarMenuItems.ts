
import { useMemo } from 'react';
import { useSecurePermissions } from '@/hooks/useSecurePermissions';
import { menuItems } from './menuConfig';

export const useSidebarMenuItems = () => {
  const permissions = useSecurePermissions();

  // Memoize the filtered menu items to prevent unnecessary re-computations
  const filteredMenuItems = useMemo(() => {
    console.log('🔍 useSidebarMenuItems: Computing menu items with permissions:', {
      isAdmin: permissions.isAdmin,
      currentUserRole: permissions.currentUser?.role_id
    });

    const items = menuItems.filter(item => {
      let hasPermission = false;
      
      if (permissions.isAdmin) {
        console.log(`🔒 Admin user, granting permission: ${item.permission}`);
        hasPermission = true;
      } else if (item.permission && typeof permissions[item.permission as keyof typeof permissions] === 'boolean') {
        hasPermission = permissions[item.permission as keyof typeof permissions] as boolean;
      }
      
      console.log(`🔍 useSidebarMenuItems: ${item.title} (${item.permission}) = ${hasPermission}`, {
        isAdmin: permissions.isAdmin,
        currentUserRole: permissions.currentUser?.role_id
      });
      
      return hasPermission;
    });

    console.log('🔍 useSidebarMenuItems: Final filtered menu items:', items.map(item => item.title));
    return items;
  }, [
    permissions.isAdmin,
    permissions.canAccessDashboard,
    permissions.canReadCompanies,
    permissions.canReadVans,
    permissions.canReadUsers,
    permissions.canReadTrips,
    permissions.canReadAuthUsers,
    permissions.currentUser?.role_id
  ]);

  return filteredMenuItems;
};
