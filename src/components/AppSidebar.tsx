
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  Building2, 
  Database, 
  List, 
  Map as MapIcon,
  Car,
  Users,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRBAC } from '@/contexts/RBACContext';
import LanguageSelector from './LanguageSelector';

const AppSidebar = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { hasPermission, currentUser, groups, loading } = useRBAC();

  console.log('AppSidebar render - currentUser:', currentUser);
  console.log('AppSidebar render - groups:', groups);
  console.log('AppSidebar render - loading:', loading);

  const menuItems = [
    {
      title: t.dashboard,
      href: '/',
      icon: Database,
      permission: 'dashboard.view',
    },
    {
      title: t.companies,
      href: '/companies',
      icon: Building2,
      permission: 'companies.view',
    },
    {
      title: 'Vans',
      href: '/vans',
      icon: Car,
      permission: 'vans.view',
    },
    {
      title: 'Users',
      href: '/users',
      icon: Users,
      permission: 'users.view',
    },
    {
      title: t.logTrip,
      href: '/trip-logger',
      icon: MapIcon,
      permission: 'trips.log',
    },
    {
      title: t.tripHistory,
      href: '/trip-history',
      icon: List,
      permission: 'trips.view',
    },
  ];

  // Debug permissions for each menu item
  menuItems.forEach(item => {
    const permission = hasPermission(item.permission);
    console.log(`Permission for ${item.title} (${item.permission}):`, permission);
  });

  const visibleMenuItems = menuItems.filter(item => {
    const permission = hasPermission(item.permission);
    console.log(`Filtering ${item.title}: has permission = ${permission}`);
    return permission;
  });

  console.log('Visible menu items:', visibleMenuItems);

  if (loading) {
    return (
      <Sidebar>
        <SidebarContent>
          <div className="flex items-center justify-center p-4">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <h1 className="text-lg font-bold text-foreground group-data-[collapsible=icon]:hidden">
              Van Fleet
            </h1>
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <LanguageSelector />
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            {/* Show debug info when no visible items */}
            {visibleMenuItems.length === 0 && (
              <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-lg mb-4 group-data-[collapsible=icon]:hidden">
                <div>No menu items visible</div>
                <div>User: {currentUser?.name || 'None'}</div>
                <div>Group: {currentUser?.groupId || 'None'}</div>
                <div>Groups loaded: {groups.length}</div>
              </div>
            )}
            
            <SidebarMenu>
              {visibleMenuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link to={item.href}>
                        <IconComponent className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
