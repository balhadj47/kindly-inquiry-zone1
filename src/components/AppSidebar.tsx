
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { useRBAC } from '@/contexts/RBACContext';
import { useIsMobile } from '@/hooks/use-mobile';
import SidebarHeader from './SidebarHeader';
import SidebarMenuContent from './SidebarMenuContent';
import UserProfile from './UserProfile';

const AppSidebar = () => {
  const { currentUser, loading } = useRBAC();
  const isMobile = useIsMobile();

  console.log('AppSidebar render - currentUser:', currentUser);
  console.log('AppSidebar render - loading:', loading);

  if (loading) {
    return (
      <Sidebar 
        collapsible="icon" 
        className={`fixed left-0 top-0 h-screen z-50 bg-white ${isMobile ? 'w-80' : ''}`}
      >
        <SidebarContent className="bg-white">
          <div className="flex items-center justify-center p-6">
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar 
      collapsible="icon" 
      className={`fixed left-0 top-0 h-screen z-50 border-r border-gray-100 bg-white shadow-sm ${
        isMobile ? 'w-80' : ''
      }`}
    >
      <SidebarHeader />
      
      <SidebarContent className="flex flex-col h-full bg-white">
        <div className="flex-1 py-6 overflow-y-auto">
          <SidebarGroup>
            <SidebarGroupContent className={`px-4 ${isMobile ? 'px-6' : ''}`}>
              <SidebarMenuContent />
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
        
        <SidebarFooter className="border-t border-gray-100 p-4 flex-shrink-0 bg-gray-50/50">
          <UserProfile />
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
