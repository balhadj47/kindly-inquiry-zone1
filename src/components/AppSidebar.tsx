
import React from 'react';
import { useLocation } from 'react-router-dom';
import SidebarBranding from './SidebarBranding';
import SidebarMenuContent from './SidebarMenuContent';

const AppSidebar = () => {
  const location = useLocation();
  
  console.log('🔧 AppSidebar: Current location:', location.pathname);

  return (
    <aside 
      className="fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 shadow-lg flex flex-col"
      style={{ 
        position: 'fixed', 
        left: '0px', 
        top: '0px', 
        height: '100vh',
        width: '256px'
      }}
    >
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-100">
        <SidebarBranding />
      </div>
      
      {/* Scrollable Menu Content - takes remaining space */}
      <div className="flex-1 overflow-y-auto py-2">
        <SidebarMenuContent />
      </div>
    </aside>
  );
};

export default AppSidebar;
