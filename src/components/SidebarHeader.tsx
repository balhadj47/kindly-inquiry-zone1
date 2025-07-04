import React from 'react';
import { SidebarHeader as UISidebarHeader } from '@/components/ui/sidebar';
import SidebarBranding from './SidebarBranding';

// This component is now deprecated - branding is handled directly in AppSidebar
// Keeping for backward compatibility but it's no longer used
const SidebarHeader = ({ className }: { className?: string }) => {
  return (
    <UISidebarHeader className={`border-b border-gray-100 transition-all duration-300 ease-in-out ${className || ''}`}>
      <div className="flex items-center justify-center p-4 group-data-[collapsible=icon]:p-2 transition-all duration-300 ease-in-out">
        <SidebarBranding />
      </div>
    </UISidebarHeader>
  );
};

export default SidebarHeader;
