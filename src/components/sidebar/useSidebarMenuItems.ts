
import { useMemo } from 'react';
import { useSecurePermissions } from '@/hooks/useSecurePermissions';
import { menuItems } from './menuConfig';

export const useSidebarMenuItems = () => {
  const permissions = useSecurePermissions();

  // Memoize the filtered menu items with stable dependencies
  const filteredMenuItems = useMemo(() => {
    console.log('🔍 useSidebarMenuItems: Computing menu items with permissions:', {
      isAdmin: permissions.isAdmin,
      currentUserRole: permissions.currentUser?.role_id,
      availablePermissions: Object.keys(permissions).filter(key => 
        key.startsWith('can') && permissions[key as keyof typeof permissions]
      )
    });

    if (!permissions.isAuthenticated) {
      console.log('🔍 useSidebarMenuItems: User not authenticated, returning empty menu');
      return [];
    }

    const items = menuItems.filter(item => {
      let hasPermission = false;
      
      if (permissions.isAdmin) {
        console.log(`🔒 Admin user, granting permission: ${item.permission}`);
        hasPermission = true;
      } else if (item.permission && typeof permissions[item.permission as keyof typeof permissions] === 'boolean') {
        hasPermission = permissions[item.permission as keyof typeof permissions] as boolean;
      }
      
      console.log(`🔍 useSidebarMenuItems: ${item.title} (${item.permission}) = ${hasPermission}`);
      
      return hasPermission;
    });

    console.log('🔍 useSidebarMenuItems: Final filtered menu items:', items.map(item => item.title));
    return items;
  }, [
    permissions.isAuthenticated,
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

// Add the missing export for compatibility
export const useRealtimeIndicators = () => {
  return {
    activeMissions: 0,
    pendingApprovals: 0,
    systemAlerts: 0,
  };
};
