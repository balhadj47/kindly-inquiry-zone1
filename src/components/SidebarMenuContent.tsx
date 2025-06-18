
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
  try {
    const { hasPermission, loading, currentUser } = useRBAC();
    const { t } = useLanguage();
    const location = useLocation();

    console.log('🔍 SidebarMenuContent render - Loading:', loading, 'User:', currentUser?.email);
    console.log('🔍 Translation object t:', t);

    const menuItems = [
      {
        title: t?.dashboard || 'Dashboard',
        url: '/dashboard',
        icon: Home,
        permission: null, // Always visible
      },
      {
        title: t?.companies || 'Companies',
        url: '/companies',
        icon: Building2,
        permission: 'companies:read',
      },
      {
        title: t?.vans || 'Vans',
        url: '/vans',
        icon: Truck,
        permission: 'vans:read',
      },
      {
        title: t?.users || 'Users',
        url: '/users',
        icon: Users,
        permission: 'users:read',
      },
      {
        title: t?.logTrip || 'Log Trip',
        url: '/trip-logger',
        icon: MapPin,
        permission: 'trips:read',
      },
      {
        title: t?.tripHistory || 'Trip History',
        url: '/trip-history',
        icon: History,
        permission: 'trips:read',
      },
      {
        title: t?.settings || 'Settings',
        url: '/settings',
        icon: Settings,
        permission: null, // Always visible
      },
    ];

    console.log('🔍 Menu items defined:', menuItems.map(item => ({ title: item.title, permission: item.permission })));

    // Show loading skeleton while RBAC initializes
    if (loading) {
      console.log('🔄 SidebarMenuContent: Showing loading skeleton');
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

    // Filter items based on permissions
    const filteredItems = menuItems.filter((item) => {
      if (!item.permission) {
        console.log(`✅ Menu item "${item.title}": no permission required, showing`);
        return true; // Always show items without permission requirements
      }
      
      try {
        const hasAccess = hasPermission(item.permission);
        console.log(`🔍 Menu item "${item.title}": permission="${item.permission}", access=${hasAccess}`);
        return hasAccess;
      } catch (error) {
        console.error(`❌ Error checking permission for ${item.title}:`, error);
        return false;
      }
    });

    console.log('🔍 SidebarMenuContent: Filtered items:', filteredItems.length, 'of', menuItems.length);
    console.log('🔍 Final menu items:', filteredItems.map(item => item.title));

    // Always show at least dashboard and settings if no other items are available
    const finalItems = filteredItems.length > 0 ? filteredItems : [
      menuItems[0], // Dashboard
      menuItems[menuItems.length - 1] // Settings
    ];

    console.log('🔍 Final items to render:', finalItems.length);

    return (
      <SidebarMenu>
        {finalItems.map((item) => {
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
  } catch (error) {
    console.error('❌ CRITICAL ERROR in SidebarMenuContent:', error);
    console.error('❌ Error stack:', error.stack);
    
    // Fallback rendering in case of critical errors
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <NavLink to="/dashboard" className="flex items-center gap-3 px-3 py-2">
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <NavLink to="/settings" className="flex items-center gap-3 px-3 py-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }
};

export default SidebarMenuContent;
