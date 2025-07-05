
import React, { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSidebarMenuItems } from './sidebar/useSidebarMenuItems';
import { cn } from '@/lib/utils';

const TopNavigation = () => {
  const location = useLocation();
  const menuItems = useSidebarMenuItems();

  // Memoize the menu items with stable pathname
  const memoizedMenuItems = useMemo(() => {
    const currentPath = location.pathname;
    console.log('🔍 TopNavigation: Rendering with', menuItems.length, 'items for', currentPath);
    
    if (menuItems.length === 0) {
      console.log('🔍 TopNavigation: No menu items to render');
      return [];
    }

    return menuItems.map((item) => {
      const isActive = currentPath === item.href || 
        (item.href === '/dashboard' && (currentPath === '/' || currentPath === '/dashboard'));
      
      return {
        ...item,
        isActive
      };
    });
  }, [menuItems, location.pathname]);

  if (memoizedMenuItems.length === 0) {
    return null;
  }

  return (
    <nav className="hidden md:flex items-center space-x-1">
      {memoizedMenuItems.map((item) => (
        <NavLink
          key={item.title}
          to={item.href}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
            item.isActive
              ? "bg-blue-100 text-blue-700"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          )}
        >
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default TopNavigation;
