
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
    <Sidebar className="border-r">
      <SidebarHeader className="border-b border-gray-100">
        <div className="p-4">
          <SidebarBranding />
        </div>
      </SidebarHeader>
      
      <SidebarContent className="py-2">
        <SidebarMenuContent />
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
