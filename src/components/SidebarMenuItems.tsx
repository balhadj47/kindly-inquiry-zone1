import { useMemo } from 'react';
import { 
  Calendar, 
  Building2, 
  Database, 
  List, 
  Map as MapIcon,
  Car,
  Users,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRBAC } from '@/contexts/RBACContext';
import { getRoleNameFromId } from '@/utils/roleUtils';

export const useSidebarMenuItems = () => {
  const { t } = useLanguage();
  const { hasPermission, currentUser, roles, loading } = useRBAC();

  // Memoize menu items definition
  const menuItems = useMemo(() => [
    {
      title: t.dashboard,
      href: '/',
      icon: Database,
      permission: 'dashboard:read',
      badge: null,
    },
    {
      title: t.companies,
      href: '/companies',
      icon: Building2,
      permission: 'companies:read',
      badge: null,
    },
    {
      title: 'Camionnettes',
      href: '/vans',
      icon: Car,
      permission: 'vans:read',
      badge: null,
    },
    {
      title: t.logTrip,
      href: '/trip-logger',
      icon: MapIcon,
      permission: 'trips:create',
      badge: null,
    },
    {
      title: t.tripHistory,
      href: '/trip-history',
      icon: List,
      permission: 'trips:read',
      badge: null,
    },
    {
      title: t.users,
      href: '/users',
      icon: Users,
      permission: 'users:read',
      badge: null,
    },
  ], [t]);

  // Filter menu items based on permissions
  const filteredMenuItems = useMemo(() => {
    console.log('=== Menu Items Filtering Debug ===');
    console.log('Loading state:', loading);
    console.log('Current user:', currentUser?.id, currentUser?.role_id);
    console.log('Roles loaded:', roles.length);
    
    // If still loading, show all items for now to avoid empty menu
    if (loading || !currentUser) {
      console.log('Still loading or no user, showing all menu items temporarily');
      return menuItems;
    }

    // If no roles loaded yet, show all items temporarily
    if (roles.length === 0) {
      console.log('No roles loaded yet, showing all menu items temporarily');
      return menuItems;
    }

    // Filter items based on permissions
    const filtered = menuItems.filter(item => {
      const hasPermissionForItem = hasPermission(item.permission);
      console.log(`Menu item "${item.title}" (${item.permission}): ${hasPermissionForItem}`);
      return hasPermissionForItem;
    });

    console.log('Final filtered menu items:', filtered.map(item => item.title));
    console.log('=== End Menu Items Filtering ===');
    
    return filtered;
  }, [menuItems, hasPermission, currentUser, roles, loading]);

  return filteredMenuItems;
};
