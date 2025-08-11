
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

const ThemeToggleButton = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
    // Force light theme on mount
    if (resolvedTheme !== 'light') {
      setTheme('light');
    }
  }, [resolvedTheme, setTheme]);

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    console.log('Toggle theme to:', newTheme);
    setTheme(newTheme);
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="w-9 h-9 p-0"
    >
      {isDark ? (
        <Sun className="h-4 w-4 transition-all" />
      ) : (
        <Moon className="h-4 w-4 transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggleButton;
