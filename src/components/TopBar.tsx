
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

const TopBar = () => {
  const isMobile = useIsMobile();

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6">
      {isMobile && (
        <SidebarTrigger className="hover:bg-accent h-8 w-8 rounded-md transition-colors" />
      )}
      
      <div className="flex-1" />
      
      {/* Future: User profile dropdown could go here */}
    </div>
  );
};

export default TopBar;
