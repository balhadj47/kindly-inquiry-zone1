
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
import { useLanguage } from '@/contexts/LanguageContext';

const AppSidebar = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  console.log('🔧 AppSidebar: Current location:', location.pathname);
  console.log('🔧 AppSidebar: Navigation translations loaded:', {
    dashboard: t.dashboard,
    companies: t.companies,
    vansDrivers: t.vansDrivers,
    users: t.users
  });

  return (
    <Sidebar 
      variant="sidebar" 
      collapsible="icon" 
      className="border-r border-gray-200 transition-all duration-300 ease-in-out"
    >
      <SidebarHeader className="transition-all duration-300 ease-in-out">
        <SidebarHeaderComponent />
      </SidebarHeader>
      
      <SidebarContent className="py-2 transition-all duration-300 ease-in-out">
        <SidebarMenuContent />
      </SidebarContent>
      
      <SidebarFooter className="transition-all duration-300 ease-in-out">
        <div className="p-3 text-xs text-gray-500 text-center group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:scale-95 transition-all duration-300 ease-in-out overflow-hidden">
          Fleet Management v1.0
        </div>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
