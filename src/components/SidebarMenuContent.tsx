
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { useRBAC } from '@/contexts/RBACContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Home,
  Building2,
  Users,
  Truck,
  MapPin,
  History,
  Settings,
} from 'lucide-react';

const SidebarMenuContent = () => {
  console.log('🔍 SidebarMenuContent: Starting render');
  
  const location = useLocation();
  console.log('🔍 Current location:', location.pathname);

  // Get language translations
  let t: any = {};
  try {
    const languageContext = useLanguage();
    t = languageContext.t || {};
    console.log('🔍 Language context loaded successfully');
  } catch (error) {
    console.error('🔍 Language context error:', error);
    // Provide fallback translations
    t = {
      dashboard: 'Dashboard',
      companies: 'Companies',
      vans: 'Vans',
      users: 'Users',
      logTrip: 'Log Trip',
      tripHistory: 'Trip History',
      settings: 'Settings'
    };
  }

  // Get RBAC context
  let hasPermission: (permission: string) => boolean = () => true; // Default to true for menu visibility
  let loading = false;
  let currentUser = null;

  try {
    const rbacContext = useRBAC();
    hasPermission = rbacContext.hasPermission;
    loading = rbacContext.loading;
    currentUser = rbacContext.currentUser;
    console.log('🔍 RBAC context loaded - User:', currentUser?.email, 'Loading:', loading);
  } catch (error) {
    console.error('🔍 RBAC context error:', error);
    // Continue with default permissions
  }

  const menuItems = [
    {
      title: t.dashboard || 'Dashboard',
      url: '/dashboard',
      icon: Home,
      permission: null, // Always visible
    },
    {
      title: t.companies || 'Companies',
      url: '/companies',
      icon: Building2,
      permission: 'companies:read',
    },
    {
      title: t.vans || 'Vans',
      url: '/vans',
      icon: Truck,
      permission: 'vans:read',
    },
    {
      title: t.users || 'Users',
      url: '/users',
      icon: Users,
      permission: 'users:read',
    },
    {
      title: t.logTrip || 'Log Trip',
      url: '/trip-logger',
      icon: MapPin,
      permission: 'trips:create',
    },
    {
      title: t.tripHistory || 'Trip History',
      url: '/trip-history',
      icon: History,
      permission: 'trips:read',
    },
    {
      title: t.settings || 'Settings',
      url: '/settings',
      icon: Settings,
      permission: null, // Always visible
    },
  ];

  console.log('🔍 Menu items defined:', menuItems.length);

  // Show loading skeleton only if we're still loading and have no user
  if (loading && !currentUser) {
    console.log('🔍 Showing loading skeleton');
    return (
      <SidebarMenu>
        {[1, 2, 3, 4].map((i) => (
          <SidebarMenuItem key={i}>
            <SidebarMenuButton asChild>
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
                <div className="h-4 bg-muted rounded animate-pulse flex-1"></div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    );
  }

  // Filter items based on permissions, but show all if we're still loading permissions
  const filteredItems = menuItems.filter((item) => {
    if (!item.permission) {
      return true; // Always show items without permission requirements
    }
    
    // If we're still loading permissions, show all items temporarily
    if (loading) {
      return true;
    }
    
    try {
      const hasAccess = hasPermission(item.permission);
      console.log(`🔍 Permission check - ${item.title}: ${item.permission} = ${hasAccess}`);
      return hasAccess;
    } catch (error) {
      console.error(`🔍 Permission check error for ${item.title}:`, error);
      return false;
    }
  });

  console.log('🔍 Filtered menu items:', filteredItems.length, 'items will be shown');

  return (
    <SidebarMenu>
      {filteredItems.map((item) => {
        const isActive = location.pathname === item.url || 
          (item.url === '/dashboard' && location.pathname === '/');
        
        console.log(`🔍 Rendering menu item: ${item.title}, active: ${isActive}`);
        
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={isActive}>
              <NavLink
                to={item.url}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{item.title}</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};

export default SidebarMenuContent;
