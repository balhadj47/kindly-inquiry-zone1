
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useThemeToggle } from '@/hooks/useThemeToggle';

const SidebarThemeToggle = () => {
  const { isDark, isLight, mounted, setLightTheme, setDarkTheme, setSystemTheme } = useThemeToggle();

  if (!mounted) {
    return (
      <div className="p-4 border-t border-border group-data-[collapsible=icon]:hidden">
        <div className="flex bg-muted rounded-lg p-1">
          <div className="flex-1 h-8 bg-background rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-border group-data-[collapsible=icon]:hidden">
      <div className="flex bg-muted rounded-lg p-1 gap-1">
        <Button
          variant="ghost"
          size="sm"
          className={`flex-1 h-8 transition-all ${
            isLight 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={setLightTheme}
        >
          <Sun className="h-4 w-4 mr-1" />
          Light
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={`flex-1 h-8 transition-all ${
            isDark 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={setDarkTheme}
        >
          <Moon className="h-4 w-4 mr-1" />
          Dark
        </Button>
      </div>
    </div>
  );
};

export default SidebarThemeToggle;
