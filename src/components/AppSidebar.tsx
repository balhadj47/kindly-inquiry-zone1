
import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import SidebarBranding from './SidebarBranding';
import SidebarUserProfile from './SidebarUserProfile';
import SidebarMenuContent from './SidebarMenuContent';

const AppSidebar = () => {
  const location = useLocation();
  
  console.log('🔧 AppSidebar: Current location:', location.pathname);

  return (
    <Sidebar 
      className="border-r border-gray-200 bg-white shadow-sm"
      collapsible="icon"
    >
      <SidebarHeader className="p-4 border-b border-gray-100">
        <SidebarBranding />
      </SidebarHeader>
      
      <SidebarContent className="py-2 bg-white">
        <SidebarMenuContent />
      </SidebarContent>
      
      <SidebarFooter className="border-t border-gray-100 p-0">
        <SidebarUserProfile />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
