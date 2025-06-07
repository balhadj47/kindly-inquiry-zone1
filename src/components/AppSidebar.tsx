
import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  Building2, 
  Database, 
  List, 
  Map as MapIcon,
  Car,
  Users,
  ChevronRight,
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
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRBAC } from '@/contexts/RBACContext';
import LanguageSelector from './LanguageSelector';
import UserProfile from './UserProfile';
import SidebarSearch from './SidebarSearch';
import SidebarBranding from './SidebarBranding';

const AppSidebar = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { hasPermission, currentUser, groups, loading } = useRBAC();
  const [searchQuery, setSearchQuery] = useState('');

  console.log('AppSidebar render - currentUser:', currentUser);
  console.log('AppSidebar render - groups:', groups);
  console.log('AppSidebar render - loading:', loading);

  const menuItems = [
    {
      title: t.dashboard,
      href: '/',
      icon: Database,
      permission: 'dashboard.view',
      badge: null,
    },
    {
      title: t.companies,
      href: '/companies',
      icon: Building2,
      permission: 'companies.view',
      badge: null,
    },
    {
      title: 'Vans',
      href: '/vans',
      icon: Car,
      permission: 'vans.view',
      badge: 'New',
    },
    {
      title: 'Users',
      href: '/users',
      icon: Users,
      permission: 'users.view',
      badge: null,
    },
    {
      title: t.logTrip,
      href: '/trip-logger',
      icon: MapIcon,
      permission: 'trips.log',
      badge: null,
    },
    {
      title: t.tripHistory,
      href: '/trip-history',
      icon: List,
      permission: 'trips.view',
      badge: null,
    },
  ];

  // Filter menu items based on permissions and search query
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(item => {
      const hasPermissionForItem = hasPermission(item.permission);
      const matchesSearch = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery);
      
      return hasPermissionForItem && matchesSearch;
    });
  }, [menuItems, hasPermission, searchQuery]);

  // Debug permissions for each menu item
  menuItems.forEach(item => {
    const permission = hasPermission(item.permission);
    console.log(`Permission for ${item.title} (${item.permission}):`, permission);
  });

  console.log('Visible menu items:', filteredMenuItems);

  if (loading) {
    return (
      <Sidebar collapsible="icon">
        <SidebarContent>
          <div className="flex items-center justify-center p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-24 mb-2"></div>
              <div className="h-3 bg-muted rounded w-16"></div>
            </div>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="hover:bg-sidebar-accent" />
            <SidebarBranding />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <LanguageSelector />
          </div>
        </div>
        <div className="px-4 pb-4">
          <SidebarSearch onSearch={setSearchQuery} />
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            {/* Show debug info when no visible items */}
            {filteredMenuItems.length === 0 && !searchQuery && (
              <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-lg mb-4 group-data-[collapsible=icon]:hidden">
                <div className="font-medium mb-2">No menu items visible</div>
                <div className="space-y-1 text-xs">
                  <div>User: {currentUser?.name || 'None'}</div>
                  <div>Group: {currentUser?.groupId || 'None'}</div>
                  <div>Groups loaded: {groups.length}</div>
                </div>
              </div>
            )}

            {/* Show no search results message */}
            {filteredMenuItems.length === 0 && searchQuery && (
              <div className="p-4 text-sm text-muted-foreground text-center group-data-[collapsible=icon]:hidden">
                No results for "{searchQuery}"
              </div>
            )}
            
            <SidebarMenu className="space-y-1">
              {filteredMenuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive} 
                      tooltip={item.title}
                      className="group relative hover:bg-sidebar-accent data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground transition-all duration-200"
                    >
                      <Link to={item.href} className="flex items-center gap-3">
                        <IconComponent className="h-4 w-4 flex-shrink-0" />
                        <span className="flex-1 truncate">{item.title}</span>
                        {item.badge && (
                          <Badge 
                            variant="secondary" 
                            className="h-5 px-1.5 text-xs group-data-[collapsible=icon]:hidden"
                          >
                            {item.badge}
                          </Badge>
                        )}
                        {isActive && (
                          <ChevronRight className="h-3 w-3 flex-shrink-0 group-data-[collapsible=icon]:hidden" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
