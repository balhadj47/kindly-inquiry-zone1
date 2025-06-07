
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
  const { currentUser, groups } = useRBAC();
  const filteredMenuItems = useSidebarMenuItems();

  return (
    <>
      {/* Show debug info when no visible items */}
      {filteredMenuItems.length === 0 && (
        <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-lg mb-4 group-data-[collapsible=icon]:hidden">
          <div className="font-medium mb-2">No menu items visible</div>
          <div className="space-y-1 text-xs opacity-75">
            <div>User: {currentUser?.name || 'None'}</div>
            <div>Group: {currentUser?.groupId || 'None'}</div>
            <div>Groups loaded: {groups.length}</div>
          </div>
        </div>
      )}
      
      <SidebarMenu className="space-y-2 px-3">
        {filteredMenuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton 
                asChild 
                isActive={isActive} 
                tooltip={item.title}
                className="relative group transition-all duration-200 hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground rounded-lg h-11"
              >
                <Link to={item.href} className="flex items-center gap-3 w-full px-3">
                  <div className="flex-shrink-0">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <span className="flex-1 truncate group-data-[collapsible=icon]:hidden font-medium">
                    {item.title}
                  </span>
                  {item.badge && (
                    <Badge 
                      variant="secondary" 
                      className="h-5 px-2 text-xs flex-shrink-0 group-data-[collapsible=icon]:hidden"
                    >
                      {item.badge}
                    </Badge>
                  )}
                  {isActive && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-primary rounded-l-md group-data-[collapsible=icon]:hidden" />
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
