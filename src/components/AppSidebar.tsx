
import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from '@/components/ui/sidebar';
import SidebarBranding from './SidebarBranding';
import SidebarHeader from './SidebarHeader';
import SidebarMenuContent from './SidebarMenuContent';
import { useLanguage } from '@/contexts/LanguageContext';

const AppSidebar = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  console.log('🔧 AppSidebar: Current location:', location.pathname);
  console.log('🔧 AppSidebar: Navigation translations loaded:', {
    dashboard: t.navigation?.dashboard,
    companies: t.navigation?.companies,
    vansDrivers: t.navigation?.vansDrivers,
    users: t.navigation?.users
  });

  return (
    <Sidebar variant="inset" className="border-r border-gray-200">
      <SidebarHeader>
        <SidebarBranding />
        <SidebarHeader />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenuContent />
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-4 text-xs text-gray-500 text-center">
          Fleet Management v1.0
        </div>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
