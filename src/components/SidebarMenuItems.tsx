
import { Home, Truck, Factory, Clock, Users, Shield } from 'lucide-react';
import { useRBAC } from '@/contexts/RBACContext';

export interface MenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<any>;
  permission?: string;
}

// Basic menu items that are always available (no permission checks)
const basicMenuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
];

// Full menu items with permissions
const fullMenuItems: MenuItem[] = [
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
    title: 'Employees',
    href: '/employees',
    icon: Users,
    permission: 'users:read',
  },
  {
    title: 'Comptes',
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
];

export const useSidebarMenuItems = () => {
  let hasPermission: (permission: string) => boolean;
  let loading: boolean;

  try {
    const rbacContext = useRBAC();
    hasPermission = rbacContext.hasPermission;
    loading = rbacContext.loading;
  } catch (error) {
    console.error('Error accessing RBAC context in useSidebarMenuItems:', error);
    // Fallback: return basic menu items if RBAC context fails
    return basicMenuItems;
  }

  // If RBAC is still loading, return all menu items for admin user (since they have admin privileges)
  if (loading) {
    console.log('🔍 RBAC still loading, returning full menu items for admin user');
    return fullMenuItems;
  }

  // Filter menu items based on permissions
  const filteredMenuItems = fullMenuItems.filter((item) => {
    if (!item.permission) return true;
    try {
      return hasPermission(item.permission);
    } catch (error) {
      console.error(`Error checking permission for ${item.title}:`, error);
      return false;
    }
  });

  console.log('🔍 Returning filtered menu items:', filteredMenuItems.length);
  return filteredMenuItems;
};
