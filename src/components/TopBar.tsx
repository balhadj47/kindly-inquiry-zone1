
import React from 'react';

const TopBar = () => {
  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6">
      <div className="flex-1" />
      
      {/* Future: User profile dropdown could go here */}
    </div>
  );
};

export default TopBar;
