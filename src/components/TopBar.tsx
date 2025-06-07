
import React from 'react';
import LanguageSelector from './LanguageSelector';

const TopBar = () => {
  return (
    <div className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-end gap-2 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <LanguageSelector />
    </div>
  );
};

export default TopBar;
