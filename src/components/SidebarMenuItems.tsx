
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

  // SIMPLIFIED FILTERING: If no roles are loaded yet, show basic menu items for authenticated users
  if (!roles || roles.length === 0) {
    console.log('🔍 No roles loaded yet, showing basic menu for authenticated user');
    return [
      {
        title: t?.dashboard || 'Dashboard',
        href: '/dashboard',
        icon: Home,
      },
      {
        title: t?.missions || 'Missions',
        href: '/missions',
        icon: Bell,
      }
    ];
  }

  // Filter menu items based on permissions - with fallback for authenticated users
  const filteredMenuItems = menuItems.filter((item) => {
    try {
      if (!item.permission) {
        console.log(`⚠️ Menu item "${item.title}" has no permission requirement - allowing for authenticated user`);
        return true; // Allow items without permission requirements for authenticated users
      }
      
      if (typeof hasPermission !== 'function') {
        console.error('⚠️ hasPermission is not a function:', typeof hasPermission);
        // Fallback: show basic items for authenticated users
        return ['dashboard:read', 'trips:read'].includes(item.permission);
      }
      
      // Check permission first
      const hasAccess = hasPermission(item.permission);
      
      // For non-admin users, be more lenient with page accessibility
      let pageAccessible = true;
      if (accessiblePages.length > 0) {
        pageAccessible = accessiblePages.includes(item.href) || hasPermission('*') || isHighPrivilegeUser();
      }
      
      // Special handling for basic permissions that all authenticated users should have
      const basicPermissions = ['dashboard:read', 'trips:read'];
      const isBasicPermission = basicPermissions.includes(item.permission);
      
      const finalAccess = hasAccess && pageAccessible;
      
      console.log(`🔍 Access check for ${item.title}:`, {
        permission: item.permission,
        hasPermission: hasAccess,
        pageAccessible: pageAccessible,
        href: item.href,
        isBasicPermission: isBasicPermission,
        finalAccess: finalAccess || isBasicPermission
      });
      
      // Grant access if user has permission OR it's a basic permission for authenticated users
      return finalAccess || isBasicPermission;
    } catch (error) {
      console.error(`🔍 Error checking permission for ${item.title}:`, error?.message || 'Unknown error');
      // Fallback: allow basic menu items for authenticated users
      return ['dashboard:read', 'trips:read'].includes(item.permission || '');
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
