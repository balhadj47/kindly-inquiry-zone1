
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { useRBAC } from '@/contexts/RBACContext';
import { useSidebarMenuItems } from './SidebarMenuItems';

const SidebarMenuContent = () => {
  const location = useLocation();
  const { currentUser, groups, loading } = useRBAC();
  const filteredMenuItems = useSidebarMenuItems();

  console.log('=== SidebarMenuContent Debug ===');
  console.log('Loading state:', loading);
  console.log('Current user:', currentUser?.id);
  console.log('Groups loaded:', groups.length);
  console.log('Filtered menu items count:', filteredMenuItems.length);
  console.log('Filtered menu items:', filteredMenuItems.map(item => item.title));

  // Show loading state while RBAC is initializing
  if (loading) {
    return (
      <div className="p-4 space-y-2 group-data-[collapsible=icon]:hidden">
        <div className="animate-pulse space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Debug info when no visible items and not loading */}
      {!loading && filteredMenuItems.length === 0 && (
        <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-lg mb-4 group-data-[collapsible=icon]:hidden">
          <div className="font-medium mb-2">No menu items visible</div>
          <div className="space-y-1 text-xs opacity-75">
            <div>User: {currentUser?.name || 'None'}</div>
            <div>Role: {currentUser?.role || 'None'}</div>
            <div>Group: {currentUser?.groupId || 'None'}</div>
            <div>Groups loaded: {groups.length}</div>
            <div>User Group Found: {groups.find(g => g.id === currentUser?.groupId)?.name || 'Not found'}</div>
          </div>
        </div>
      )}
      
      <SidebarMenu className="space-y-1 px-2">
        {filteredMenuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton 
                asChild 
                isActive={isActive} 
                tooltip={item.title}
                className="relative group transition-all duration-200 hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground rounded-lg h-10"
              >
                <Link to={item.href} className="flex items-center gap-3 w-full px-3">
                  <div className="flex-shrink-0 flex items-center justify-center">
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <span className="flex-1 truncate group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 font-medium transition-all duration-200">
                    {item.title}
                  </span>
                  {item.badge && (
                    <Badge 
                      variant="secondary" 
                      className="h-5 px-2 text-xs flex-shrink-0 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 transition-all duration-200"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </>
  );
};

export default SidebarMenuContent;
