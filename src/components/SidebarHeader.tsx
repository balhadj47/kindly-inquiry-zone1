
import React from 'react';
import { SidebarHeader as UISidebarHeader } from '@/components/ui/sidebar';
import SidebarBranding from './SidebarBranding';

const SidebarHeader = () => {
  return (
    <UISidebarHeader className="border-b border-gray-100 bg-white">
      <div className="flex items-center justify-center p-4 group-data-[collapsible=icon]:p-3">
        <SidebarBranding />
      </div>
    </UISidebarHeader>
  );
};

export default SidebarHeader;
