
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const useThemeToggle = () => {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Better theme detection with fallbacks
  const currentTheme = resolvedTheme || systemTheme || 'light';
  const isDark = currentTheme === 'dark';
  const isLight = currentTheme === 'light';

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    console.log('Toggling theme from', currentTheme, 'to', newTheme);
    setTheme(newTheme);
  };

  const setLightTheme = () => {
    console.log('Setting light theme');
    setTheme('light');
  };
  
  const setDarkTheme = () => {
    console.log('Setting dark theme');
    setTheme('dark');
  };
  
  const setSystemTheme = () => {
    console.log('Setting system theme');
    setTheme('system');
  };

  // Debug logging
  useEffect(() => {
    if (mounted) {
      console.log('Theme debug:', {
        theme,
        resolvedTheme,
        systemTheme,
        currentTheme,
        isDark,
        isLight
      });
    }
  }, [theme, resolvedTheme, systemTheme, currentTheme, isDark, isLight, mounted]);

  return {
    theme,
    resolvedTheme: currentTheme,
    isDark,
    isLight,
    mounted,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    setSystemTheme,
  };
};
