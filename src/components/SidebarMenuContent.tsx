
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
  const { hasPermission } = useRBAC();
  const { t } = useLanguage();
  const location = useLocation();

  console.log('🔍 SidebarMenuContent: Translation object:', t);
  console.log('🔍 SidebarMenuContent: Available keys:', Object.keys(t));

  const menuItems = [
    {
      title: t.dashboard || 'Dashboard',
      url: '/dashboard',
      icon: Home,
      permission: null,
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
      permission: 'trips:read',
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
      permission: null,
    },
  ];

  console.log('🔍 SidebarMenuContent: All menu items:', menuItems);

  const filteredItems = menuItems.filter(
    (item) => {
      const hasAccess = !item.permission || hasPermission(item.permission);
      console.log(`🔍 SidebarMenuContent: ${item.title} - Permission: ${item.permission}, Has Access: ${hasAccess}`);
      return hasAccess;
    }
  );

  console.log('🔍 SidebarMenuContent: Filtered items count:', filteredItems.length);
  console.log('🔍 SidebarMenuContent: Filtered items:', filteredItems.map(item => item.title));

  if (filteredItems.length === 0) {
    console.warn('⚠️ SidebarMenuContent: No menu items available after filtering!');
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground">
              <Home className="h-4 w-4 flex-shrink-0" />
              <span>No menu items available</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      {filteredItems.map((item) => {
        const isActive = location.pathname === item.url || 
          (item.url === '/dashboard' && location.pathname === '/');
        
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
