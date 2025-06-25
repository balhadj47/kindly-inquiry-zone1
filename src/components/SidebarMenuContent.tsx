
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

  // Add badge counts for menu items
  const menuItemsWithBadges = useMemo(() => {
    return menuItems.map((item) => {
      const isActive = location.pathname === item.href || 
        (item.href === '/dashboard' && (location.pathname === '/' || location.pathname === '/dashboard'));
      
      // Add badge counts based on menu item
      let badge = null;
      if (item.href === '/log-trip') {
        badge = { count: 32, variant: 'default' as const };
      } else if (item.href === '/trip-history') {
        badge = { count: 4, variant: 'secondary' as const };
      } else if (item.href === '/auth-users') {
        badge = { count: 9, variant: 'secondary' as const };
      }
      
      return {
        ...item,
        isActive,
        badge
      };
    });
  }, [menuItems, location.pathname]);

  return (
    <div className="px-4 py-2">
      <SidebarMenu>
        {menuItemsWithBadges.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton 
              asChild 
              isActive={item.isActive}
              tooltip={item.title}
              className={`
                w-full justify-between group
                ${item.isActive 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              <NavLink 
                to={item.href}
                className="flex items-center justify-between w-full"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                </div>
                {item.badge && (
                  <Badge 
                    variant={item.badge.variant}
                    className={`
                      group-data-[collapsible=icon]:hidden text-xs
                      ${item.isActive 
                        ? 'bg-blue-800 text-blue-100' 
                        : 'bg-gray-700 text-gray-300'
                      }
                    `}
                  >
                    {item.badge.count}
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
