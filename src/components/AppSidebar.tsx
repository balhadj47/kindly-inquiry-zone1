
import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail
} from '@/components/ui/sidebar';
import SidebarUserProfile from './SidebarUserProfile';
import SidebarMenuContent from './SidebarMenuContent';

const AppSidebar = () => {
  const location = useLocation();
  
  console.log('🔧 AppSidebar: Current location:', location.pathname);

  return (
    <Sidebar 
      variant="sidebar" 
      collapsible="icon" 
      className="border-r border-gray-200 bg-white"
    >
      <SidebarHeader className="p-0">
        <SidebarUserProfile />
      </SidebarHeader>
      
      <SidebarContent className="py-0 bg-white">
        <SidebarMenuContent />
      </SidebarContent>
      
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
