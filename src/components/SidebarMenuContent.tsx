
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useSidebarMenuItems } from './SidebarMenuItems';

const SidebarMenuContent = () => {
  console.log('🔍 SidebarMenuContent: Starting render');
  
  const location = useLocation();
  const menuItems = useSidebarMenuItems();
  
  console.log('🔍 Current location:', location.pathname);
  console.log('🔍 Menu items from useSidebarMenuItems:', menuItems.length);

  return (
    <SidebarMenu className="space-y-1 px-3">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.href || 
          (item.href === '/dashboard' && (location.pathname === '/' || location.pathname === '/dashboard'));
        
        console.log(`🔍 Rendering menu item: ${item.title}, href: ${item.href}, active: ${isActive}`);
        
        return (
          <SidebarMenuItem key={item.title}>
            <NavLink 
              to={item.href}
              className={({ isActive: navIsActive }) => {
                const activeState = navIsActive || isActive;
                return `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full ${
                  activeState 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                } group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2`;
              }}
              onClick={(e) => {
                console.log('🔍 NavLink clicked:', item.href);
                console.log('🔍 Current pathname before navigation:', location.pathname);
                console.log('🔍 Event details:', e.type, e.currentTarget);
              }}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="truncate font-medium text-sm group-data-[collapsible=icon]:hidden">
                {item.title}
              </span>
            </NavLink>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};

export default SidebarMenuContent;
