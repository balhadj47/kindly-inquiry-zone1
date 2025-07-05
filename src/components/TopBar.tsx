
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import TopBarUserProfile from './TopBarUserProfile';
import TopNavigation from './TopNavigation';
import SidebarBranding from './SidebarBranding';

const TopBar = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex-shrink-0 flex h-16 items-center justify-between gap-4 border-b border-border bg-background px-4 sm:px-6">
      {/* Left side - Branding */}
      <div className="flex items-center">
        <SidebarBranding />
      </div>
      
      {/* Center - Navigation menu (desktop only) */}
      <TopNavigation />
      
      {/* Right side - User profile */}
      <div className="flex items-center">
        <TopBarUserProfile />
      </div>
    </div>
  );
};

export default TopBar;
