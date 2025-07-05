
import React from 'react';
import { useLocation } from 'react-router-dom';
import SidebarBranding from './SidebarBranding';
import SidebarMenuContent from './SidebarMenuContent';
import SidebarUserProfile from './SidebarUserProfile';

const AppSidebar = () => {
  const location = useLocation();
  
  console.log('🔧 AppSidebar: Current location:', location.pathname);

  return (
    <aside 
      className="fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 shadow-lg flex flex-col"
      style={{ position: 'fixed' }} // Inline style to ensure it overrides any conflicting CSS
    >
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-100 bg-white">
        <SidebarBranding />
      </div>
      
      {/* Scrollable Menu Content */}
      <div className="flex-1 overflow-y-auto py-2 bg-white">
        <SidebarMenuContent />
      </div>

      {/* Fixed Footer */}
      <div className="flex-shrink-0 border-t border-gray-100 bg-white">
        <SidebarUserProfile />
      </div>
    </aside>
  );
};

export default AppSidebar;
