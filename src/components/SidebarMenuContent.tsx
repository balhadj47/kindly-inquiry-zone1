
import React, { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { useSidebarMenuItems, useRealtimeIndicators } from './sidebar/useSidebarMenuItems';
import IndicatorBadge from './sidebar/IndicatorBadge';

const SidebarMenuContent = React.memo(() => {
  const location = useLocation();
  const menuItems = useSidebarMenuItems();
  const indicators = useRealtimeIndicators();
  
  console.log('🔍 SidebarMenuContent: Rendering with', menuItems.length, 'items for', location.pathname);
  console.log('🔍 SidebarMenuContent: Indicators:', indicators);

  // Define color schemes for different icons
  const getIconColor = (href: string, isActive: boolean) => {
    const colorMap = {
      '/dashboard': isActive ? 'text-blue-600' : 'text-blue-500 group-hover:text-blue-600',
      '/companies': isActive ? 'text-purple-600' : 'text-purple-500 group-hover:text-purple-600',
      '/vans': isActive ? 'text-green-600' : 'text-green-500 group-hover:text-green-600',
      '/employees': isActive ? 'text-orange-600' : 'text-orange-500 group-hover:text-orange-600',
      '/auth-users': isActive ? 'text-red-600' : 'text-red-500 group-hover:text-red-600',
      '/missions': isActive ? 'text-indigo-600' : 'text-indigo-500 group-hover:text-indigo-600',
    };
    
    return colorMap[href] || (isActive ? 'text-gray-600' : 'text-gray-500 group-hover:text-gray-600');
  };

  // Get indicator count for a menu item
  const getIndicatorCount = (indicatorKey?: string) => {
    if (!indicatorKey) return 0;
    return indicators[indicatorKey as keyof typeof indicators] || 0;
  };

  // Get badge variant based on indicator type
  const getBadgeVariant = (indicatorKey?: string) => {
    switch (indicatorKey) {
      case 'systemAlerts':
        return 'destructive' as const;
      case 'pendingApprovals':
        return 'secondary' as const;
      case 'activeMissions':
        return 'default' as const;
      default:
        return 'default' as const;
    }
  };

  // Add active state for menu items
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

  if (menuItems.length === 0) {
    console.log('🔍 SidebarMenuContent: No menu items to render');
    return (
      <div className="px-2 py-2 text-center text-gray-500">
        <p className="text-sm">No menu items available</p>
      </div>
    );
  }

  return (
    <div className="px-2 py-2 space-y-1 group-data-[collapsible=icon]:px-1">
      <SidebarMenu className="space-y-1">
        {menuItemsWithActiveState.map((item) => {
          const indicatorCount = getIndicatorCount(item.indicatorKey);
          const badgeVariant = getBadgeVariant(item.indicatorKey);
          
          return (
            <SidebarMenuItem key={item.title} className="group/item">
              <SidebarMenuButton 
                asChild 
                isActive={item.isActive}
                tooltip={item.title}
                className={`
                  w-full group relative overflow-hidden
                  transition-all duration-200 ease-in-out
                  group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10
                  group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center
                  group-data-[collapsible=icon]:rounded-lg
                  ${item.isActive 
                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-r-3 border-blue-500 shadow-sm group-data-[collapsible=icon]:border-r-0 group-data-[collapsible=icon]:bg-blue-100' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm group-data-[collapsible=icon]:hover:bg-gray-100'
                  }
                  before:absolute before:inset-0 before:bg-gradient-to-r 
                  ${item.isActive 
                    ? 'before:from-blue-50/50 before:to-transparent group-data-[collapsible=icon]:before:hidden' 
                    : 'before:from-gray-50/0 hover:before:from-gray-50/50 before:to-transparent group-data-[collapsible=icon]:before:hidden'
                  }
                  before:transition-all before:duration-200 before:ease-in-out
                  ${item.className || ''}
                `}
              >
                <NavLink 
                  to={item.href}
                  className="flex items-center w-full relative z-10 group-data-[collapsible=icon]:justify-center"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:gap-0">
                    <item.icon className={`
                      h-5 w-5 flex-shrink-0 transition-all duration-200
                      group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5
                      ${getIconColor(item.href, item.isActive)}
                    `} />
                    <span className={`
                      group-data-[collapsible=icon]:hidden font-medium transition-all duration-200
                      ${item.isActive ? 'text-blue-700' : 'text-gray-700 group-hover:text-gray-900'}
                    `}>
                      {item.title}
                    </span>
                    <div className="group-data-[collapsible=icon]:hidden">
                      <IndicatorBadge 
                        count={indicatorCount} 
                        variant={badgeVariant}
                      />
                    </div>
                  </div>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </div>
  );
});

SidebarMenuContent.displayName = 'SidebarMenuContent';

export default SidebarMenuContent;
