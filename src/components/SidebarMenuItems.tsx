
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
  
  // Menu items without log-trip
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
      title: t?.authUsers || 'Auth Users',
      href: '/auth-users',
      icon: Shield,
      permission: 'auth-users:read',
    },
    {
      title: t?.missions || 'Missions',
      href: '/missions',
      icon: Bell,
      permission: 'trips:read',
    },
  ];
  
  // Get current user's role and accessible pages
  const currentRole = roles.find(role => role.role_id === currentUser?.role_id);
  const accessiblePages = currentRole?.accessiblePages || [];
  
  // Dynamic privilege detection
  const isHighPrivilegeUser = () => {
    if (!currentUser?.role_id || !roles) return false;
    
    const userRole = roles.find(role => role.role_id === currentUser.role_id);
    if (!userRole) return false;
    
    // High privilege users have many permissions (10+)
    return userRole.permissions.length >= 10;
  };
  
  console.log('🔍 Menu items processing:', {
    userId: currentUser?.id || 'null',
    userEmail: currentUser?.email || 'null',
    roleId: currentUser?.role_id || 'null',
    roleName: currentRole?.name || 'null',
    loading: loading,
    rolesCount: roles?.length || 0,
    accessiblePages: accessiblePages,
    hasPermissionFunction: typeof hasPermission === 'function',
    isHighPrivilegeUser: isHighPrivilegeUser()
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

  // If no roles are loaded yet, wait (but allow high privilege user access)
  if (!roles || roles.length === 0) {
    if (isHighPrivilegeUser()) {
      console.log('🔍 High privilege user detected, showing all menu items despite no roles loaded');
      return menuItems;
    }
    console.log('🔍 No roles loaded yet, returning empty menu');
    return [];
  }

  // Filter menu items based on both permissions and accessible pages
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
      
      // Check both permission and page accessibility
      const hasAccess = hasPermission(item.permission);
      const pageAccessible = accessiblePages.includes(item.href) || hasPermission('*') || isHighPrivilegeUser();
      
      console.log(`🔍 Access check for ${item.title}:`, {
        permission: item.permission,
        hasPermission: hasAccess,
        pageAccessible: pageAccessible,
        href: item.href,
        finalAccess: hasAccess && pageAccessible
      });
      
      return hasAccess && pageAccessible;
    } catch (error) {
      console.error(`🔍 Error checking permission for ${item.title}:`, error?.message || 'Unknown error');
      return false;
    }
  });

  console.log('🔍 FINAL RESULT:', {
    totalMenuItems: menuItems.length,
    filteredCount: filteredMenuItems.length,
    filteredTitles: filteredMenuItems.map(item => item.title),
    userRole: currentRole?.name,
    userPermissions: currentRole?.permissions || [],
    userPages: accessiblePages
  });
  
  return filteredMenuItems;
};
