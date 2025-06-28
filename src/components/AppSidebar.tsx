
import React from 'react';
import { useLocation } from 'react-router-dom';
import SidebarBranding from './SidebarBranding';
import SidebarUserProfile from './SidebarUserProfile';
import SidebarMenuContent from './SidebarMenuContent';

const AppSidebar = () => {
  const location = useLocation();
  
  console.log('🔧 AppSidebar: Current location:', location.pathname);

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 shadow-sm flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <SidebarBranding />
      </div>
      
      {/* Content */}
      <div className="flex-1 py-2 bg-white">
        <SidebarMenuContent />
      </div>
      
      {/* Footer */}
      <div className="border-t border-gray-100">
        <SidebarUserProfile />
      </div>
    </div>
  );
};

export default AppSidebar;
