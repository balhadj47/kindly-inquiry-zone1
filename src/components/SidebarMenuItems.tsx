
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
  const { hasPermission, currentUser, groups } = useRBAC();

  // Memoize menu items definition
  const menuItems = useMemo(() => {
    console.log('Creating menu items definition');
    return [
      {
        title: t.dashboard,
        href: '/',
        icon: Database,
        permission: 'dashboard.view',
        badge: null,
      },
      {
        title: t.companies,
        href: '/companies',
        icon: Building2,
        permission: 'companies.view',
        badge: null,
      },
      {
        title: 'Camionnettes',
        href: '/vans',
        icon: Car,
        permission: 'vans.view',
        badge: null,
      },
      {
        title: t.users,
        href: '/users',
        icon: Users,
        permission: 'users.view',
        badge: null,
      },
      {
        title: t.logTrip,
        href: '/trip-logger',
        icon: MapIcon,
        permission: 'trips.log',
        badge: null,
      },
      {
        title: t.tripHistory,
        href: '/trip-history',
        icon: List,
        permission: 'trips.view',
        badge: null,
      },
    ];
  }, [t]);

  // Memoize filtered menu items with proper dependencies
  const filteredMenuItems = useMemo(() => {
    console.log('Filtering menu items for user:', currentUser?.id);
    
    if (!currentUser) {
      console.log('No current user, returning empty menu');
      return [];
    }

    const filtered = menuItems.filter(item => {
      const hasPermissionForItem = hasPermission(item.permission);
      console.log(`Menu item ${item.title} permission ${item.permission}: ${hasPermissionForItem}`);
      return hasPermissionForItem;
    });

    console.log('Filtered menu items:', filtered.map(item => item.title));
    return filtered;
  }, [menuItems, hasPermission, currentUser?.id, currentUser?.groupId, groups.length]);

  return filteredMenuItems;
};
