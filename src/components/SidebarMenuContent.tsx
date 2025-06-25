
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { useSidebarMenuItems } from './SidebarMenuItems';

const SidebarMenuContent = () => {
  console.log('🔍 SidebarMenuContent: Starting render');
  
  const location = useLocation();
  const menuItems = useSidebarMenuItems();
  
  console.log('🔍 SidebarMenuContent: Menu items loaded:', menuItems.length);
  console.log('🔍 SidebarMenuContent: Current location:', location.pathname);

  return (
    <SidebarMenu className="space-y-1 px-2">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.href || 
          (item.href === '/dashboard' && (location.pathname === '/' || location.pathname === '/dashboard'));
        
        console.log(`🔍 SidebarMenuContent: Rendering ${item.title}, active: ${isActive}`);
        
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton 
              asChild 
              isActive={isActive}
              tooltip={item.title}
              className="w-full"
            >
              <NavLink 
                to={item.href}
                className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
                onClick={() => {
                  console.log('🔍 SidebarMenuContent: NavLink clicked:', item.href);
                }}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium text-sm group-data-[collapsible=icon]:sr-only">
                  {item.title}
                </span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};

export default SidebarMenuContent;
