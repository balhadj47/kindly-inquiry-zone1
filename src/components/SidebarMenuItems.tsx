
import { Home, Truck, Factory, Clock, Users, Shield } from 'lucide-react';
import { useRBAC } from '@/contexts/RBACContext';

export interface MenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<any>;
  permission?: string;
}

// Full menu items - with proper permission requirements
const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    permission: 'dashboard:read', // Now requires dashboard permission
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
    permission: 'auth-users:read', // Changed from 'users:read' to 'auth-users:read'
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
  
  const { hasPermission, currentUser, loading, roles } = useRBAC();
  
  console.log('🔍 DETAILED Menu items processing:', {
    userId: currentUser?.id,
    userEmail: currentUser?.email,
    roleId: currentUser?.role_id,
    loading: loading,
    rolesCount: roles?.length || 0,
    rolesData: roles?.map(r => ({ id: r.id, name: r.name, permissions: r.permissions })) || []
  });

  // If still loading, return empty array to avoid flashing unauthorized menu items
  if (loading) {
    console.log('🔍 RBAC context still loading, returning empty menu');
    return [];
  }

  // If no user is logged in, return empty menu
  if (!currentUser) {
    console.log('🔍 No current user, returning empty menu');
    return [];
  }

  // If no roles are loaded yet, wait
  if (!roles || roles.length === 0) {
    console.log('🔍 No roles loaded yet, returning empty menu');
    return [];
  }

  console.log('🔍 SUPERVISOR CHECK - User role_id:', currentUser.role_id, 'Expected permissions for Supervisor (role_id 2):', ['dashboard:read', 'companies:read', 'vans:read', 'trips:read']);

  // Filter menu items based on permissions
  const filteredMenuItems = menuItems.filter((item) => {
    // All menu items now require permissions - no exceptions
    if (!item.permission) {
      console.log(`⚠️ Menu item "${item.title}" has no permission requirement - this should not happen`);
      return false;
    }
    
    // Check if user has the required permission
    const hasAccess = hasPermission(item.permission);
    console.log(`🔍 DETAILED Permission check for ${item.title} (${item.permission}): ${hasAccess} for user ${currentUser.email} with role_id ${currentUser.role_id}`);
    
    return hasAccess;
  });

  console.log('🔍 FINAL RESULT:', {
    totalMenuItems: menuItems.length,
    filteredCount: filteredMenuItems.length,
    filteredTitles: filteredMenuItems.map(item => item.title),
    userRole: currentUser.role_id,
    userEmail: currentUser.email
  });
  
  return filteredMenuItems;
};
