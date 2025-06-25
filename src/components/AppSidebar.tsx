
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
    <Sidebar variant="sidebar" collapsible="icon" className="border-r border-gray-200">
      <SidebarHeader>
        <SidebarHeaderComponent />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenuContent />
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-4 text-xs text-gray-500 text-center group-data-[collapsible=icon]:hidden">
          Fleet Management v1.0
        </div>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
