
import React from 'react';
import { SidebarHeader as UISidebarHeader, SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import SidebarBranding from './SidebarBranding';

const SidebarHeader = () => {
  const isMobile = useIsMobile();

  return (
    <UISidebarHeader className="border-b border-gray-100 bg-white">
      <div className="flex items-center justify-between p-6 group-data-[collapsible=icon]:justify-center">
        {/* Only show SidebarTrigger on desktop */}
        {!isMobile && (
          <SidebarTrigger className="hover:bg-gray-100 h-8 w-8 rounded-lg transition-colors flex-shrink-0 text-gray-600" />
        )}
        <div className={`flex-1 group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:ml-0 ${!isMobile ? 'ml-4' : ''}`}>
          <SidebarBranding />
        </div>
      </div>
    </UISidebarHeader>
  );
};

export default SidebarHeader;
