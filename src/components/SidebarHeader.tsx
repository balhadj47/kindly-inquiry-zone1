
import React from 'react';
import { SidebarHeader as UISidebarHeader, SidebarTrigger } from '@/components/ui/sidebar';
import SidebarBranding from './SidebarBranding';

const SidebarHeader = () => {
  return (
    <UISidebarHeader className="border-b border-sidebar-border">
      <div className="flex items-center justify-between p-2">
        <SidebarTrigger className="hover:bg-sidebar-accent h-8 w-8" />
        <div className="flex-1 ml-2">
          <SidebarBranding />
        </div>
      </div>
    </UISidebarHeader>
  );
};

export default SidebarHeader;
