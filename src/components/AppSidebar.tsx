
import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from '@/components/ui/sidebar';
import SidebarBranding from './SidebarBranding';
import SidebarMenuContent from './SidebarMenuContent';

const AppSidebar = () => {
  const location = useLocation();
  
  console.log('🔧 AppSidebar: Current location:', location.pathname);

  return (
    <Sidebar 
      className="border-r border-gray-200 bg-white shadow-sm h-screen"
      collapsible="icon"
    >
      <div className="flex flex-col h-full">
        <SidebarHeader className="flex-shrink-0 p-4 border-b border-gray-100">
          <SidebarBranding />
        </SidebarHeader>
        
        <SidebarContent className="flex-1 py-2 bg-white overflow-y-auto">
          <SidebarMenuContent />
        </SidebarContent>
      </div>
    </Sidebar>
  );
};

export default AppSidebar;
