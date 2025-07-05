
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
      <div className="flex flex-col h-full min-h-0">
        <SidebarHeader className="flex-shrink-0 p-4 border-b border-gray-100">
          <SidebarBranding />
        </SidebarHeader>
        
        <SidebarContent className="flex-1 py-2 bg-white overflow-y-auto">
          <SidebarMenuContent />
        </SidebarContent>
        
        <SidebarFooter className="flex-shrink-0 border-t border-gray-100 p-0 sticky bottom-0 bg-white">
          <SidebarUserProfile />
        </SidebarFooter>
      </div>
    </Sidebar>
  );
};

export default AppSidebar;
