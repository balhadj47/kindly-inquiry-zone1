
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
import SidebarSearchBar from './SidebarSearchBar';
import SidebarMenuContent from './SidebarMenuContent';
import SidebarTeamsSection from './SidebarTeamsSection';
import SidebarDragDropArea from './SidebarDragDropArea';
import SidebarThemeToggle from './SidebarThemeToggle';

const AppSidebar = () => {
  const location = useLocation();
  
  console.log('🔧 AppSidebar: Current location:', location.pathname);

  return (
    <Sidebar 
      variant="sidebar" 
      collapsible="icon" 
      className="border-r border-gray-700 bg-gray-900"
    >
      <SidebarHeader className="p-0">
        <SidebarUserProfile />
        <SidebarSearchBar />
      </SidebarHeader>
      
      <SidebarContent className="py-0 bg-gray-900">
        <SidebarMenuContent />
        <SidebarTeamsSection />
      </SidebarContent>
      
      <SidebarFooter className="p-0 bg-gray-900">
        <SidebarDragDropArea />
        <SidebarThemeToggle />
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
