
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
              className="w-full transition-all duration-300 ease-in-out hover:scale-105"
            >
              <NavLink 
                to={item.href}
                className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 transition-all duration-300 ease-in-out"
                onClick={() => {
                  console.log('🔍 SidebarMenuContent: NavLink clicked:', item.href);
                }}
              >
                <item.icon className="h-5 w-5 flex-shrink-0 transition-all duration-300 ease-in-out group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5" />
                <span className="font-medium text-sm group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:scale-95 group-data-[collapsible=icon]:w-0 transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap">
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
