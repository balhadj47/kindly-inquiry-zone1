
import React from 'react';
import LanguageSelector from './LanguageSelector';

const TopBar = () => {
  return (
    <div className="flex justify-end items-center p-4 border-b border-border bg-background">
      <LanguageSelector />
    </div>
  );
};

export default TopBar;
