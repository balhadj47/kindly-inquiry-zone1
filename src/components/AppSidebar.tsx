
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { useRBAC } from '@/contexts/RBACContext';
import SidebarHeader from './SidebarHeader';
import SidebarMenuContent from './SidebarMenuContent';
import UserProfile from './UserProfile';

const AppSidebar = () => {
  const { currentUser, loading } = useRBAC();

  console.log('AppSidebar render - currentUser:', currentUser);
  console.log('AppSidebar render - loading:', loading);

  if (loading) {
    return (
      <Sidebar collapsible="icon">
        <SidebarContent>
          <div className="flex items-center justify-center p-6">
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-muted rounded w-24"></div>
              <div className="h-3 bg-muted rounded w-16"></div>
            </div>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader />
      
      <SidebarContent className="flex flex-col flex-1">
        <div className="flex-1 py-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenuContent />
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
        
        <SidebarFooter className="border-t border-sidebar-border p-4 mt-auto">
          <UserProfile />
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
