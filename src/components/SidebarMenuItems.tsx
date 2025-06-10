
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

  const menuItems = useMemo(() => [
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
  ], [t]);

  // Filter menu items based on permissions - memoized to prevent unnecessary recalculations
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(item => {
      const hasPermissionForItem = hasPermission(item.permission);
      return hasPermissionForItem;
    });
  }, [menuItems, hasPermission, currentUser?.id, groups]);

  return filteredMenuItems;
};
