
import { Home, Truck, Factory, Clock, Users, Shield } from 'lucide-react';

export interface MenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<any>;
  permission?: string;
}

export const useSidebarMenuItems = () => {
  console.log('🔍 useSidebarMenuItems: Starting hook execution');
  
  // Safe context access with proper error handling
  let hasPermission: (permission: string) => boolean = () => false;
  let currentUser: any = null;
  let loading = true;
  let roles: any[] = [];
  let t: any = {
    dashboard: 'Dashboard',
    companies: 'Companies',
    vansDrivers: 'Vans & Drivers',
    employees: 'Employees',
    comptes: 'Accounts',
    logTrip: 'Log Trip',
    tripHistory: 'Trip History'
  };
  
  try {
    // Dynamic imports with safe context access
    const { useRBAC } = require('@/contexts/RBACContext');
    const { useLanguage } = require('@/contexts/LanguageContext');
    
    const rbacContext = useRBAC();
    if (rbacContext && typeof rbacContext === 'object') {
      hasPermission = rbacContext.hasPermission || (() => false);
      currentUser = rbacContext.currentUser;
      loading = rbacContext.loading;
      roles = rbacContext.roles || [];
      
      console.log('🔍 useSidebarMenuItems: RBAC context loaded successfully');
    } else {
      console.warn('🔍 useSidebarMenuItems: RBAC context not available');
    }
    
    const languageContext = useLanguage();
    if (languageContext && typeof languageContext === 'object' && languageContext.t) {
      t = languageContext.t;
      console.log('🔍 useSidebarMenuItems: Language context loaded successfully');
    } else {
      console.warn('🔍 useSidebarMenuItems: Language context not available, using defaults');
    }
  } catch (error) {
    console.warn('🔍 useSidebarMenuItems: Context access error:', error?.message || 'Unknown error');
    // Continue with fallback values
  }
  
  // Menu items with safe fallbacks
  const menuItems: MenuItem[] = [
    {
      title: t?.dashboard || 'Dashboard',
      href: '/dashboard',
      icon: Home,
      permission: 'dashboard:read',
    },
    {
      title: t?.companies || 'Companies',
      href: '/companies',
      icon: Factory,
      permission: 'companies:read',
    },
    {
      title: t?.vansDrivers || 'Vans & Drivers',
      href: '/vans-drivers',
      icon: Truck,
      permission: 'vans:read',
    },
    {
      title: t?.employees || 'Employees',
      href: '/employees',
      icon: Users,
      permission: 'users:read',
    },
    {
      title: t?.comptes || 'Accounts',
      href: '/auth-users',
      icon: Shield,
      permission: 'auth-users:read',
    },
    {
      title: t?.logTrip || 'Log Trip',
      href: '/log-trip',
      icon: Clock,
      permission: 'trips:create',
    },
    {
      title: t?.tripHistory || 'Trip History',
      href: '/trip-history',
      icon: Clock,
      permission: 'trips:read',
    },
  ];
  
  console.log('🔍 Menu items processing:', {
    userId: currentUser?.id || 'null',
    userEmail: currentUser?.email || 'null',
    roleId: currentUser?.role_id || 'null',
    loading: loading,
    rolesCount: roles?.length || 0,
    hasPermissionFunction: typeof hasPermission === 'function'
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

  // If no roles are loaded yet, wait (but allow admin access)
  if (!roles || roles.length === 0) {
    if (currentUser.role_id === 1 || currentUser.id === 'admin-temp') {
      console.log('🔍 Admin user detected, showing all menu items despite no roles loaded');
      return menuItems;
    }
    console.log('🔍 No roles loaded yet, returning empty menu');
    return [];
  }

  // Filter menu items based on permissions
  const filteredMenuItems = menuItems.filter((item) => {
    try {
      if (!item.permission) {
        console.log(`⚠️ Menu item "${item.title}" has no permission requirement`);
        return false;
      }
      
      if (typeof hasPermission !== 'function') {
        console.error('⚠️ hasPermission is not a function:', typeof hasPermission);
        return false;
      }
      
      const hasAccess = hasPermission(item.permission);
      console.log(`🔍 Permission check for ${item.title} (${item.permission}): ${hasAccess}`);
      
      return hasAccess;
    } catch (error) {
      console.error(`🔍 Error checking permission for ${item.title}:`, error?.message || 'Unknown error');
      return false;
    }
  });

  console.log('🔍 FINAL RESULT:', {
    totalMenuItems: menuItems.length,
    filteredCount: filteredMenuItems.length,
    filteredTitles: filteredMenuItems.map(item => item.title)
  });
  
  return filteredMenuItems;
};
