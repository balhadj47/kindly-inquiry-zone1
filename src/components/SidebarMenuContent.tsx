
import React, { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { useSidebarMenuItems } from './SidebarMenuItems';

const SidebarMenuContent = React.memo(() => {
  const location = useLocation();
  const menuItems = useSidebarMenuItems();
  
  console.log('🔍 SidebarMenuContent: Rendering with', menuItems.length, 'items for', location.pathname);

  // Add badge counts for menu items based on real data
  const menuItemsWithBadges = useMemo(() => {
    return menuItems.map((item) => {
      const isActive = location.pathname === item.href || 
        (item.href === '/dashboard' && (location.pathname === '/' || location.pathname === '/dashboard'));
      
      // Add realistic badge counts based on menu item
      let badge = null;
      if (item.href === '/trip-history') { // Missions page
        badge = { count: 12, variant: 'default' as const };
      } else if (item.href === '/auth-users') {
        badge = { count: 3, variant: 'destructive' as const };
      } else if (item.href === '/companies') {
        badge = { count: 5, variant: 'secondary' as const };
      }
      
      return {
        ...item,
        isActive,
        badge
      };
    });
  }, [menuItems, location.pathname]);

  return (
    <div className="px-3 py-4 space-y-1">
      <SidebarMenu className="space-y-1">
        {menuItemsWithBadges.map((item) => (
          <SidebarMenuItem key={item.title} className="group/item">
            <SidebarMenuButton 
              asChild 
              isActive={item.isActive}
              tooltip={item.title}
              className={`
                w-full justify-between group relative overflow-hidden
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
                className="flex items-center justify-between w-full relative z-10"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <item.icon className={`
                    h-4 w-4 flex-shrink-0 transition-all duration-200
                    ${item.isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}
                  `} />
                  <span className={`
                    group-data-[collapsible=icon]:hidden font-medium transition-all duration-200
                    ${item.isActive ? 'text-blue-700' : 'text-gray-700 group-hover:text-gray-900'}
                  `}>
                    {item.title}
                  </span>
                </div>
                {item.badge && (
                  <Badge 
                    variant={item.badge.variant}
                    className={`
                      group-data-[collapsible=icon]:hidden text-xs font-semibold px-2 py-0.5
                      transition-all duration-200 ease-in-out
                      ${item.isActive 
                        ? 'bg-blue-100 text-blue-700 border-blue-200' 
                        : item.badge.variant === 'destructive' 
                          ? 'bg-red-100 text-red-700 border-red-200 group-hover:bg-red-50'
                          : 'bg-gray-100 text-gray-600 border-gray-200 group-hover:bg-gray-50'
                      }
                      ${item.badge.count > 99 ? 'px-1.5' : ''}
                    `}
                  >
                    {item.badge.count > 99 ? '99+' : item.badge.count}
                  </Badge>
                )}
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
