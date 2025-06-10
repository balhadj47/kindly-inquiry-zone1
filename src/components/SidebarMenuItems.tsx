
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

export const useSidebarMenuItems = () => {
  const { t } = useLanguage();
  const { hasPermission, currentUser, groups, loading } = useRBAC();

  // Memoize menu items definition with corrected permission format
  const menuItems = useMemo(() => {
    console.log('Creating menu items definition');
    return [
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
        title: t.users,
        href: '/users',
        icon: Users,
        permission: 'users:read',
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
    ];
  }, [t]);

  // Memoize filtered menu items with proper dependencies
  const filteredMenuItems = useMemo(() => {
    console.log('Filtering menu items for user:', currentUser?.id);
    console.log('Loading state:', loading);
    console.log('Groups available:', groups.length);
    
    // If still loading, return empty array
    if (loading) {
      console.log('Still loading RBAC data, returning empty menu');
      return [];
    }

    // If no current user, return empty array
    if (!currentUser) {
      console.log('No current user, returning empty menu');
      return [];
    }

    // If no groups loaded, return empty array
    if (groups.length === 0) {
      console.log('No groups loaded, returning empty menu');
      return [];
    }

    const filtered = menuItems.filter(item => {
      const hasPermissionForItem = hasPermission(item.permission);
      console.log(`Menu item ${item.title} permission ${item.permission}: ${hasPermissionForItem}`);
      return hasPermissionForItem;
    });

    console.log('Filtered menu items:', filtered.map(item => item.title));
    return filtered;
  }, [menuItems, hasPermission, currentUser?.id, currentUser?.groupId, groups.length, loading]);

  return filteredMenuItems;
};
