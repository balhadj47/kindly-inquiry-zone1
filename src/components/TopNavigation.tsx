
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSidebarMenuItems } from './sidebar/useSidebarMenuItems';
import { cn } from '@/lib/utils';

const TopNavigation = () => {
  const location = useLocation();
  const menuItems = useSidebarMenuItems();

  console.log('🔍 TopNavigation: Rendering with', menuItems.length, 'items for', location.pathname);

  if (menuItems.length === 0) {
    console.log('🔍 TopNavigation: No menu items to render');
    return null;
  }

  return (
    <nav className="hidden md:flex items-center space-x-1">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.href || 
          (item.href === '/dashboard' && (location.pathname === '/' || location.pathname === '/dashboard'));
        
        return (
          <NavLink
            key={item.title}
            to={item.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
              isActive
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default TopNavigation;
