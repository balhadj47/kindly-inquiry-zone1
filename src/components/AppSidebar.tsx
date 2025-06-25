
import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from '@/components/ui/sidebar';
import SidebarUserProfile from './SidebarUserProfile';
import SidebarMenuContent from './SidebarMenuContent';
import SidebarThemeToggle from './SidebarThemeToggle';

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
      
      <SidebarFooter className="p-0 bg-white">
        <SidebarThemeToggle />
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
