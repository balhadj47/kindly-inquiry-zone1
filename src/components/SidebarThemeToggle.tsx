
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun } from 'lucide-react';

const SidebarThemeToggle = () => {
  return (
    <div className="p-4 border-t border-gray-200 group-data-[collapsible=icon]:hidden">
      <div className="flex bg-gray-50 rounded-lg p-1">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 h-8 bg-white text-gray-700 shadow-sm"
          disabled
        >
          <Sun className="h-4 w-4 mr-1" />
          Light
        </Button>
      </div>
    </div>
  );
};

export default SidebarThemeToggle;
