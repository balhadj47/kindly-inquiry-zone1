
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
  
  // Dynamic privilege detection
  const isHighPrivilegeUser = () => {
    if (!currentUser?.role_id || !roles) return false;
    
    const userRole = roles.find(role => (role as any).role_id === currentUser.role_id);
    if (!userRole) return false;
    
    // High privilege users have many permissions (10+)
    return userRole.permissions.length >= 10;
  };

  // Check if user has auth-users permissions specifically
  const hasAuthUsersPermission = () => {
    if (isHighPrivilegeUser()) return true;
    
    // Check for specific auth-users permissions
    const authUsersPermissions = [
      'auth-users:read',
      'auth-users:create',
      'auth-users:update',
      'auth-users:delete'
    ];
    
    return authUsersPermissions.some(perm => {
      try {
        return hasPermission(perm);
      } catch (error) {
        console.error('Error checking permission:', perm, error);
        return false;
      }
    });
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

  // Only add Auth Users if user has proper permissions
  if (hasAuthUsersPermission()) {
    menuItems.push({
      title: t?.authUsers || 'Auth Users',
      href: '/auth-users',
      icon: Shield,
      permission: 'auth-users:read',
    });
  }
  
  console.log('🔍 Menu items processing:', {
    userId: currentUser?.id || 'null',
    userEmail: currentUser?.email || 'null',
    roleId: currentUser?.role_id || 'null',
    loading: loading,
    rolesCount: roles?.length || 0,
    hasPermissionFunction: typeof hasPermission === 'function',
    hasAuthUsersPermission: hasAuthUsersPermission(),
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
      
      // Special handling for auth-users permission
      if (item.permission === 'auth-users:read') {
        const hasAccess = hasAuthUsersPermission();
        console.log(`🔍 Auth Users access check:`, {
          permission: item.permission,
          hasPermission: hasAccess,
          href: item.href,
          finalAccess: hasAccess
        });
        return hasAccess;
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
    filteredTitles: filteredMenuItems.map(item => item.title)
  });
  
  return filteredMenuItems;
};
