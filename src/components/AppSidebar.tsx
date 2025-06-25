
import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarRail
} from '@/components/ui/sidebar';
import SidebarBranding from './SidebarBranding';
import SidebarUserProfile from './SidebarUserProfile';
import SidebarMenuContent from './SidebarMenuContent';

const AppSidebar = () => {
  const location = useLocation();
  
  console.log('🔧 AppSidebar: Current hash location:', location.pathname, window.location.hash);

  return (
    <Sidebar 
      variant="sidebar" 
      collapsible="icon" 
      className="border-r border-gray-200 bg-white shadow-sm group-data-[collapsible=icon]:shadow-md"
    >
      <SidebarHeader className="p-4 border-b border-gray-100 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:border-b-0">
        <SidebarBranding />
      </SidebarHeader>
      
      <SidebarContent className="py-2 bg-white flex-1 group-data-[collapsible=icon]:py-3">
        <SidebarMenuContent />
      </SidebarContent>
      
      <SidebarFooter className="p-0">
        <SidebarUserProfile />
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
