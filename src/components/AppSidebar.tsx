
import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from '@/components/ui/sidebar';
import SidebarHeaderComponent from './SidebarHeader';
import SidebarMenuContent from './SidebarMenuContent';

const AppSidebar = () => {
  const location = useLocation();
  
  console.log('🔧 AppSidebar: Current location:', location.pathname);

  return (
    <Sidebar 
      variant="sidebar" 
      collapsible="icon" 
      className="border-r border-gray-200"
    >
      <SidebarHeader>
        <SidebarHeaderComponent />
      </SidebarHeader>
      
      <SidebarContent className="py-2">
        <SidebarMenuContent />
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-3 text-xs text-gray-500 text-center group-data-[collapsible=icon]:hidden">
          Fleet Management v1.0
        </div>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
