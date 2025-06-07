
import React from 'react';
import { SidebarHeader as UISidebarHeader, SidebarTrigger } from '@/components/ui/sidebar';
import LanguageSelector from './LanguageSelector';
import SidebarBranding from './SidebarBranding';

const SidebarHeader = () => {
  return (
    <UISidebarHeader className="border-b border-sidebar-border">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="hover:bg-sidebar-accent" />
          <SidebarBranding />
        </div>
        <div className="group-data-[collapsible=icon]:hidden">
          <LanguageSelector />
        </div>
      </div>
    </UISidebarHeader>
  );
};

export default SidebarHeader;
