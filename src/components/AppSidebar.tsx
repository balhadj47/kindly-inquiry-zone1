
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
  
  console.log('🔧 AppSidebar: Current location:', location.pathname);

  return (
    <Sidebar 
      variant="sidebar" 
      collapsible="icon" 
      className="border-r border-gray-200 bg-white shadow-sm"
    >
      <SidebarHeader className="p-6 border-b border-gray-100">
        <SidebarBranding />
      </SidebarHeader>
      
      <SidebarContent className="py-2 bg-white flex-1">
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
