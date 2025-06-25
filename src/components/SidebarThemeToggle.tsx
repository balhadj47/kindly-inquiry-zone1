
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

const SidebarThemeToggle = () => {
  const [isDark, setIsDark] = React.useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className="p-4 group-data-[collapsible=icon]:hidden">
      <div className="flex bg-gray-800 rounded-lg p-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className={`flex-1 h-8 ${!isDark ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          <Sun className="h-4 w-4 mr-1" />
          Light
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className={`flex-1 h-8 ${isDark ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          <Moon className="h-4 w-4 mr-1" />
          Dark
        </Button>
      </div>
    </div>
  );
};

export default SidebarThemeToggle;
