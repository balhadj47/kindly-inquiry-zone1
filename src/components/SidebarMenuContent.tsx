
import React, { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { useSidebarMenuItems } from './SidebarMenuItems';

const SidebarMenuContent = React.memo(() => {
  const location = useLocation();
  const menuItems = useSidebarMenuItems();
  
  console.log('🔍 SidebarMenuContent: Rendering with', menuItems.length, 'items for', location.pathname);

  // Define color schemes for different icons
  const getIconColor = (href: string, isActive: boolean) => {
    const colorMap = {
      '/dashboard': isActive ? 'text-blue-600' : 'text-blue-500 group-hover:text-blue-600',
      '/companies': isActive ? 'text-purple-600' : 'text-purple-500 group-hover:text-purple-600',
      '/vans-drivers': isActive ? 'text-green-600' : 'text-green-500 group-hover:text-green-600',
      '/employees': isActive ? 'text-orange-600' : 'text-orange-500 group-hover:text-orange-600',
      '/auth-users': isActive ? 'text-red-600' : 'text-red-500 group-hover:text-red-600',
      '/log-trip': isActive ? 'text-indigo-600' : 'text-indigo-500 group-hover:text-indigo-600',
      '/trip-history': isActive ? 'text-amber-600' : 'text-amber-500 group-hover:text-amber-600',
    };
    
    return colorMap[href] || (isActive ? 'text-gray-600' : 'text-gray-500 group-hover:text-gray-600');
  };

  // Add active state for menu items without badges
  const menuItemsWithActiveState = useMemo(() => {
    return menuItems.map((item) => {
      const isActive = location.pathname === item.href || 
        (item.href === '/dashboard' && (location.pathname === '/' || location.pathname === '/dashboard'));
      
      return {
        ...item,
        isActive
      };
    });
  }, [menuItems, location.pathname]);

  return (
    <div className="px-3 py-4 space-y-1">
      <SidebarMenu className="space-y-1">
        {menuItemsWithActiveState.map((item) => (
          <SidebarMenuItem key={item.title} className="group/item">
            <SidebarMenuButton 
              asChild 
              isActive={item.isActive}
              tooltip={item.title}
              className={`
                w-full group relative overflow-hidden
                transition-all duration-200 ease-in-out
                ${item.isActive 
                  ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-r-3 border-blue-500 shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                }
                before:absolute before:inset-0 before:bg-gradient-to-r 
                ${item.isActive 
                  ? 'before:from-blue-50/50 before:to-transparent' 
                  : 'before:from-gray-50/0 hover:before:from-gray-50/50 before:to-transparent'
                }
                before:transition-all before:duration-200 before:ease-in-out
              `}
            >
              <NavLink 
                to={item.href}
                className="flex items-center w-full relative z-10"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <item.icon className={`
                    h-4 w-4 flex-shrink-0 transition-all duration-200
                    ${getIconColor(item.href, item.isActive)}
                  `} />
                  <span className={`
                    group-data-[collapsible=icon]:hidden font-medium transition-all duration-200
                    ${item.isActive ? 'text-blue-700' : 'text-gray-700 group-hover:text-gray-900'}
                  `}>
                    {item.title}
                  </span>
                </div>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </div>
  );
});

SidebarMenuContent.displayName = 'SidebarMenuContent';

export default SidebarMenuContent;
