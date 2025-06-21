
import React from 'react';
import { SidebarHeader as UISidebarHeader, SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import SidebarBranding from './SidebarBranding';

const SidebarHeader = () => {
  const isMobile = useIsMobile();

  return (
    <UISidebarHeader className="border-b border-gray-100 bg-white">
      <div className="flex items-center justify-between p-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-3">
        <div className="flex-1 group-data-[collapsible=icon]:flex-none">
          <SidebarBranding />
        </div>
        {/* Only show SidebarTrigger on desktop and when not collapsed */}
        {!isMobile && (
          <div className="group-data-[collapsible=icon]:hidden">
            <SidebarTrigger className="hover:bg-gray-100 h-8 w-8 rounded-lg transition-colors flex-shrink-0 text-gray-600 ml-2" />
          </div>
        )}
      </div>
    </UISidebarHeader>
  );
};

export default SidebarHeader;
