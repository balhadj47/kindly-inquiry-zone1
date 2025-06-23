
import { Home, Users, Truck, Factory, Settings, Clock, Shield } from 'lucide-react';
import { useRBAC } from '@/contexts/RBACContext';

export interface MenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<any>;
  permission?: string;
}

export const useSidebarMenuItems = () => {
  const { hasPermission } = useRBAC();

  const allMenuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: Home,
    },
    {
      title: 'Companies',
      href: '/companies',
      icon: Factory,
      permission: 'companies:read',
    },
    {
      title: 'Vans & Drivers',
      href: '/vans-drivers',
      icon: Truck,
      permission: 'vans:read',
    },
    {
      title: 'Users',
      href: '/users',
      icon: Users,
      permission: 'users:read',
    },
    {
      title: 'Auth Users',
      href: '/auth-users',
      icon: Shield,
      permission: 'users:read',
    },
    {
      title: 'Log Mission',
      href: '/log-trip',
      icon: Clock,
      permission: 'trips:create',
    },
    {
      title: 'Mission History',
      href: '/trip-history',
      icon: Clock,
      permission: 'trips:read',
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  // Filter menu items based on permissions
  const filteredMenuItems = allMenuItems.filter((item) => {
    if (!item.permission) return true;
    try {
      return hasPermission(item.permission);
    } catch (error) {
      console.error(`Error checking permission for ${item.title}:`, error);
      return false;
    }
  });

  return filteredMenuItems;
};
