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
  
  // Enhanced permission checking for auth-users - STRICT CHECK
  const hasAuthUsersPermission = () => {
    console.log('🔍 Checking auth-users permission for user:', {
      userId: currentUser?.id,
      email: currentUser?.email || 'no email',
      roleId: currentUser?.role_id,
      rolesLoaded: roles?.length > 0,
      hasPermissionFunction: typeof hasPermission === 'function'
    });

    // If still loading, deny access to prevent showing unauthorized items
    if (loading) {
      console.log('🔍 Still loading, denying auth-users access');
      return false;
    }

    // If no current user, deny access
    if (!currentUser || !currentUser.id) {
      console.log('🔍 No current user, denying auth-users access');
      return false;
    }

    // If no hasPermission function, deny access
    if (typeof hasPermission !== 'function') {
      console.log('🔍 No hasPermission function available, denying access');
      return false;
    }

    // Check specifically for auth-users:read permission - STRICT CHECK
    try {
      const result = hasPermission('auth-users:read');
      console.log('🔍 Permission check for auth-users:read:', result);
      return result === true;
    } catch (error) {
      console.error('Error checking auth-users:read permission:', error);
      return false;
    }
  };

  // Menu items with proper permission checks
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
  ];

  // Check auth users permission BEFORE filtering - STRICT CHECK
  const shouldShowAuthUsers = hasAuthUsersPermission();
  console.log('🔍 Should show Auth Users menu item:', shouldShowAuthUsers);
  
  // ONLY add Auth Users if permission check passes
  if (shouldShowAuthUsers) {
    console.log('✅ Adding Auth Users to menu');
    menuItems.push({
      title: t?.authUsers || 'Auth Users',
      href: '/auth-users',
      icon: Shield,
      permission: 'auth-users:read',
    });
  } else {
    console.log('❌ Auth Users NOT added to menu - no auth-users:read permission');
  }
  
  console.log('🔍 Menu items processing:', {
    userId: currentUser?.id || 'null',
    userEmail: currentUser?.email || 'null',
    roleId: currentUser?.role_id || 'null',
    loading: loading,
    rolesCount: roles?.length || 0,
    hasPermissionFunction: typeof hasPermission === 'function',
    menuItemsCount: menuItems.length,
    hasAuthUsersInMenu: menuItems.some(item => item.href === '/auth-users')
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

  // ENHANCED: Show basic menu items for all authenticated users
  const basicMenuForAuthenticated = [
    {
      title: t?.dashboard || 'Dashboard',
      href: '/dashboard',
      icon: Home,
    },
    {
      title: t?.companies || 'Companies',
      href: '/companies',
      icon: Factory,
    },
    {
      title: t?.vans || 'Vans',
      href: '/vans',
      icon: Truck,
    },
    {
      title: t?.missions || 'Missions',
      href: '/missions',
      icon: Bell,
    }
  ];

  // If no roles are loaded yet, show basic menu items for authenticated users
  if (!roles || roles.length === 0) {
    console.log('🔍 No roles loaded yet, showing basic menu for authenticated user');
    return basicMenuForAuthenticated;
  }

  // Filter menu items based on permissions - but be more permissive
  const filteredMenuItems = menuItems.filter((item) => {
    try {
      if (!item.permission) {
        console.log(`⚠️ Menu item "${item.title}" has no permission requirement - allowing for authenticated user`);
        return true;
      }
      
      if (typeof hasPermission !== 'function') {
        console.error('⚠️ hasPermission is not a function:', typeof hasPermission);
        // Show basic items for authenticated users
        return ['dashboard:read', 'trips:read', 'companies:read', 'vans:read'].includes(item.permission);
      }
      
      // Special handling for auth-users permission - should already be pre-approved
      if (item.permission === 'auth-users:read') {
        // This item was already pre-approved when we added it above
        console.log('🔍 Auth-users item was pre-approved - allowing');
        return true;
      }
      
      // Check permission for other items
      const hasAccess = hasPermission(item.permission);
      
      console.log(`🔍 Access check for ${item.title}:`, {
        permission: item.permission,
        hasPermission: hasAccess,
        href: item.href,
        finalAccess: hasAccess
      });
      
      return hasAccess;
    } catch (error) {
      console.error(`🔍 Error checking permission for ${item.title}:`, error?.message || 'Unknown error');
      // Fallback: allow basic menu items for authenticated users
      return ['dashboard:read', 'trips:read', 'companies:read', 'vans:read'].includes(item.permission || '');
    }
  });

  console.log('🔍 FINAL RESULT:', {
    totalMenuItems: menuItems.length,
    filteredCount: filteredMenuItems.length,
    filteredTitles: filteredMenuItems.map(item => item.title),
    hasAuthUsers: filteredMenuItems.some(item => item.href === '/auth-users')
  });
  
  return filteredMenuItems;
};
