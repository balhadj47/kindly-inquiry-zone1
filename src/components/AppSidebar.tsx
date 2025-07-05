
import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import SidebarBranding from './SidebarBranding';
import SidebarMenuContent from './SidebarMenuContent';
import SidebarUserProfile from './SidebarUserProfile';

const AppSidebar = () => {
  const location = useLocation();
  
  console.log('🔧 AppSidebar: Current location:', location.pathname);

  return (
    <Sidebar 
      className="border-r border-gray-200 bg-white shadow-sm"
      collapsible="icon"
    >
      {/* Fixed Header */}
      <SidebarHeader className="p-4 border-b border-gray-100">
        <SidebarBranding />
      </SidebarHeader>
      
      {/* Scrollable Menu Content */}
      <SidebarContent className="flex-1 py-2 bg-white">
        <SidebarMenuContent />
      </SidebarContent>

      {/* Fixed Footer */}
      <SidebarFooter className="border-t border-gray-100">
        <SidebarUserProfile />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
