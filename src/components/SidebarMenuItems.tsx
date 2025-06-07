
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
  const { hasPermission } = useRBAC();

  const menuItems = [
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
      title: 'Vans',
      href: '/vans',
      icon: Car,
      permission: 'vans.view',
      badge: 'New',
    },
    {
      title: 'Users',
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

  // Filter menu items based on permissions only (no search query)
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(item => {
      const hasPermissionForItem = hasPermission(item.permission);
      return hasPermissionForItem;
    });
  }, [menuItems, hasPermission]);

  // Debug permissions for each menu item
  menuItems.forEach(item => {
    const permission = hasPermission(item.permission);
    console.log(`Permission for ${item.title} (${item.permission}):`, permission);
  });

  console.log('Visible menu items:', filteredMenuItems);

  return filteredMenuItems;
};
