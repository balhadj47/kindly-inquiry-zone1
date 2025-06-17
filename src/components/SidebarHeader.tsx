
import React from 'react';
import { SidebarHeader as UISidebarHeader, SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import SidebarBranding from './SidebarBranding';

const SidebarHeader = () => {
  const isMobile = useIsMobile();

  return (
    <UISidebarHeader className="border-b border-sidebar-border">
      <div className="flex items-center justify-between p-4 group-data-[collapsible=icon]:justify-center">
        {/* Only show SidebarTrigger on desktop */}
        {!isMobile && (
          <SidebarTrigger className="hover:bg-sidebar-accent h-8 w-8 rounded-md transition-colors flex-shrink-0" />
        )}
        <div className={`flex-1 group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:ml-0 ${!isMobile ? 'ml-3' : ''}`}>
          <SidebarBranding />
        </div>
      </div>
    </UISidebarHeader>
  );
};

export default SidebarHeader;
