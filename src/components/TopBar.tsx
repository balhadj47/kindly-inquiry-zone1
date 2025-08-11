
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import TopBarUserProfile from './TopBarUserProfile';
import TopNavigation from './TopNavigation';
import SidebarBranding from './SidebarBranding';
import ThemeToggleButton from './ThemeToggleButton';

const TopBar = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex-shrink-0 flex h-16 items-center justify-between gap-6 border-b border-border bg-background px-6 shadow-sm">
      {/* Left side - Enhanced Branding */}
      <div className="flex items-center min-w-0">
        <div className="flex items-center gap-3">
          <SidebarBranding />
        </div>
      </div>
      
      {/* Center - Navigation menu (desktop only) */}
      <div className="flex-1 flex justify-center">
        <TopNavigation />
      </div>
      
      {/* Right side - Theme toggle and User profile */}
      <div className="flex items-center gap-2 min-w-0">
        <ThemeToggleButton />
        <TopBarUserProfile />
      </div>
    </div>
  );
};

export default TopBar;
