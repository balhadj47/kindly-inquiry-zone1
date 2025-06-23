
import { Home, Truck, Factory, Clock, Users, Shield } from 'lucide-react';
import { useRBAC } from '@/contexts/RBACContext';

export interface MenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<any>;
  permission?: string;
}

// Full menu items - always available
const menuItems: MenuItem[] = [
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
  console.log('🔍 useSidebarMenuItems: Starting hook execution');
  
  // Always return menu items, but safely check permissions
  let hasPermission: (permission: string) => boolean = () => true; // Default to allow all
  let currentUser: any = null;

  try {
    const rbacContext = useRBAC();
    if (rbacContext && rbacContext.hasPermission) {
      hasPermission = rbacContext.hasPermission;
      currentUser = rbacContext.currentUser;
    }
  } catch (error) {
    console.warn('⚠️ RBAC context not available, showing all menu items:', error);
  }

  console.log('🔍 Menu items processing - user:', currentUser?.id, 'loading state bypassed');

  // Filter menu items only if we have a working permission function
  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.permission) {
      return true; // Always show items without permission requirements
    }
    
    try {
      // If no user or permission function fails, show the item (fail open for better UX)
      return hasPermission(item.permission);
    } catch (error) {
      console.warn(`⚠️ Permission check failed for ${item.title}, showing item:`, error);
      return true; // Fail open - show the item
    }
  });

  console.log('🔍 Final menu items count:', filteredMenuItems.length);
  return filteredMenuItems;
};
