
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import SidebarHeader from './SidebarHeader';
import SidebarMenuContent from './SidebarMenuContent';
import UserProfile from './UserProfile';

const AppSidebar = () => {
  const isMobile = useIsMobile();
  
  console.log('🔍 AppSidebar render - always showing sidebar with menu items');

  return (
    <Sidebar 
      collapsible="icon" 
      className="border-r border-gray-200 bg-white group-data-[collapsible=icon]:w-16"
    >
      <SidebarHeader />
      
      <SidebarContent className="flex flex-col h-full bg-white px-3 group-data-[collapsible=icon]:px-2">
        <div className="flex-1 py-4 overflow-y-auto">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenuContent />
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
        
        <SidebarFooter className="border-t border-gray-100 p-3 group-data-[collapsible=icon]:p-2">
          <UserProfile />
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
