
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
  
  const { hasPermission, currentUser, loading } = useRBAC();
  
  console.log('🔍 Menu items processing - user:', currentUser?.id, 'loading:', loading);

  // If still loading, return empty array to avoid flashing unauthorized menu items
  if (loading) {
    console.log('🔍 RBAC context still loading, returning empty menu');
    return [];
  }

  // Filter menu items based on permissions
  const filteredMenuItems = menuItems.filter((item) => {
    // Always show items without permission requirements (like Dashboard)
    if (!item.permission) {
      return true;
    }
    
    // Check if user has the required permission
    const hasAccess = hasPermission(item.permission);
    console.log(`🔍 Permission check for ${item.title} (${item.permission}): ${hasAccess}`);
    
    return hasAccess;
  });

  console.log('🔍 Final filtered menu items count:', filteredMenuItems.length);
  console.log('🔍 Filtered menu items:', filteredMenuItems.map(item => item.title));
  
  return filteredMenuItems;
};
