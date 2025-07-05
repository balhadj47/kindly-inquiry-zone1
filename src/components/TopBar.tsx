
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import TopBarUserProfile from './TopBarUserProfile';

const TopBar = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex-shrink-0 flex h-16 items-center justify-between gap-4 border-b border-border bg-background px-4 sm:px-6">
      {!isMobile && <SidebarTrigger className="hover:bg-accent h-8 w-8 rounded-md transition-colors" />}
      
      <div className="flex-1" />
      
      {/* User profile moved to top right */}
      <div className="flex items-center">
        <TopBarUserProfile />
      </div>
    </div>
  );
};

export default TopBar;
