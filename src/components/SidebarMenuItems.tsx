
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
  console.log('🔍 useSidebarMenuItems: Starting hook execution');
  
  let hasPermission: (permission: string) => boolean;
  let loading: boolean;
  let currentUser: any;

  try {
    const rbacContext = useRBAC();
    hasPermission = rbacContext.hasPermission;
    loading = rbacContext.loading;
    currentUser = rbacContext.currentUser;
    
    console.log('🔍 RBAC context state:', { 
      loading, 
      hasCurrentUser: !!currentUser,
      currentUserId: currentUser?.id,
      currentUserRoleId: currentUser?.role_id 
    });
  } catch (error) {
    console.error('❌ Error accessing RBAC context in useSidebarMenuItems:', error);
    // Fallback: return basic menu items if RBAC context fails
    return basicMenuItems;
  }

  // If RBAC is still loading or no current user, return full menu items for now
  // This ensures the menu is always visible while data loads
  if (loading || !currentUser) {
    console.log('🔍 RBAC still loading or no user, returning full menu items');
    return fullMenuItems;
  }

  console.log('🔍 RBAC loaded, filtering menu items based on permissions');

  // Filter menu items based on permissions
  const filteredMenuItems = fullMenuItems.filter((item) => {
    if (!item.permission) {
      console.log('🔍 Item has no permission requirement:', item.title);
      return true;
    }
    
    try {
      const hasAccess = hasPermission(item.permission);
      console.log(`🔍 Permission check: ${item.title} (${item.permission}) = ${hasAccess}`);
      return hasAccess;
    } catch (error) {
      console.error(`❌ Error checking permission for ${item.title}:`, error);
      return false;
    }
  });

  console.log('🔍 Final filtered menu items count:', filteredMenuItems.length);
  return filteredMenuItems;
};
