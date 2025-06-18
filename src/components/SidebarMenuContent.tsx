
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
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

  const menuItems = [
    {
      title: t.dashboard || 'Dashboard',
      url: '/dashboard',
      icon: Home,
    },
    {
      title: t.companies || 'Companies',
      url: '/companies',
      icon: Building2,
    },
    {
      title: t.vans || 'Vans',
      url: '/vans',
      icon: Truck,
    },
    {
      title: t.users || 'Users',
      url: '/users',
      icon: Users,
    },
    {
      title: t.logTrip || 'Log Trip',
      url: '/trip-logger',
      icon: MapPin,
    },
    {
      title: t.tripHistory || 'Trip History',
      url: '/trip-history',
      icon: History,
    },
    {
      title: t.settings || 'Settings',
      url: '/settings',
      icon: Settings,
    },
  ];

  console.log('🔍 Menu items defined:', menuItems.length);

  return (
    <SidebarMenu>
      {menuItems.map((item) => {
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
