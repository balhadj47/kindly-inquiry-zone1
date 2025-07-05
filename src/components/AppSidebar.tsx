
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
    <div className="fixed left-0 top-0 h-screen w-64 border-r border-gray-200 bg-white shadow-sm z-40 flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-100">
        <SidebarBranding />
      </div>
      
      {/* Scrollable Menu Content */}
      <div className="flex-1 overflow-y-auto py-2 bg-white">
        <SidebarMenuContent />
      </div>

      {/* Fixed Footer */}
      <div className="flex-shrink-0 border-t border-gray-100">
        <SidebarUserProfile />
      </div>
    </div>
  );
};

export default AppSidebar;
