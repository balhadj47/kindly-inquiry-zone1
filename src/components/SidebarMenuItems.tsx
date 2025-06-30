
import { Home, Truck, Factory, Clock, Users, Shield, Bell, MessageSquare, Inbox } from 'lucide-react';
import { useRBAC } from '@/contexts/RBACContext';
import { useLanguage } from '@/contexts/LanguageContext';

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
    logTrip: 'Log Trip',
    missions: 'Missions',
    companies: 'Companies',
    authUsers: 'Auth Users',
    vans: 'Vans',
    employees: 'Employees'
  };
  
  try {
    const rbacContext = useRBAC();
    if (rbacContext && typeof rbacContext === 'object') {
      hasPermission = rbacContext.hasPermission || (() => false);
      currentUser = rbacContext.currentUser;
      loading = rbacContext.loading;
      roles = Array.isArray(rbacContext.roles) ? rbacContext.roles : [];
      
      console.log('🔍 useSidebarMenuItems: RBAC context loaded successfully');
    } else {
      console.warn('🔍 useSidebarMenuItems: RBAC context not available');
    }
  } catch (error) {
    console.warn('🔍 useSidebarMenuItems: RBAC context access error:', error?.message || 'Unknown error');
  }
  
  try {
    const languageContext = useLanguage();
    if (languageContext && typeof languageContext === 'object' && languageContext.t) {
      t = languageContext.t;
      console.log('🔍 useSidebarMenuItems: Language context loaded successfully');
    } else {
      console.warn('🔍 useSidebarMenuItems: Language context not available, using defaults');
    }
  } catch (error) {
    console.warn('🔍 useSidebarMenuItems: Language context access error:', error?.message || 'Unknown error');
  }

  // Define all possible menu items with their required read permissions
  const allMenuItems: MenuItem[] = [
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
      title: t?.vans || 'Vans',
      href: '/vans',
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
      title: t?.missions || 'Missions',
      href: '/missions',
      icon: Bell,
      permission: 'trips:read',
    },
    {
      title: t?.authUsers || 'Auth Users',
      href: '/auth-users',
      icon: Shield,
      permission: 'auth-users:read',
    },
  ];

  console.log('🔍 Menu items processing:', {
    userId: currentUser?.id || 'null',
    userEmail: currentUser?.email || 'null',
    roleId: currentUser?.role_id || 'null',
    loading: loading,
    rolesCount: roles?.length || 0,
    hasPermissionFunction: typeof hasPermission === 'function',
    totalMenuItemsCount: allMenuItems.length
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

  // If no roles are loaded yet, return empty menu to prevent showing unauthorized items
  if (!roles || roles.length === 0) {
    console.log('🔍 No roles loaded yet, returning empty menu');
    return [];
  }

  // Filter menu items based on read permissions
  const filteredMenuItems = allMenuItems.filter((item) => {
    try {
      if (!item.permission) {
        console.log(`⚠️ Menu item "${item.title}" has no permission requirement - skipping`);
        return false;
      }
      
      if (typeof hasPermission !== 'function') {
        console.error('⚠️ hasPermission is not a function:', typeof hasPermission);
        return false;
      }
      
      // Check permission for each item
      const hasAccess = hasPermission(item.permission);
      
      console.log(`🔍 Permission check for ${item.title}:`, {
        permission: item.permission,
        hasPermission: hasAccess,
        href: item.href
      });
      
      return hasAccess;
    } catch (error) {
      console.error(`🔍 Error checking permission for ${item.title}:`, error?.message || 'Unknown error');
      return false;
    }
  });

  console.log('🔍 FINAL RESULT:', {
    totalMenuItems: allMenuItems.length,
    filteredCount: filteredMenuItems.length,
    filteredTitles: filteredMenuItems.map(item => item.title),
    hasAuthUsers: filteredMenuItems.some(item => item.href === '/auth-users'),
    hasVans: filteredMenuItems.some(item => item.href === '/vans'),
    hasCompanies: filteredMenuItems.some(item => item.href === '/companies'),
    hasUsers: filteredMenuItems.some(item => item.href === '/employees'),
    hasMissions: filteredMenuItems.some(item => item.href === '/missions')
  });
  
  return filteredMenuItems;
};
