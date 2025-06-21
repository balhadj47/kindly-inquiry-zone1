
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
    <SidebarMenu className="space-y-1">
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
                return `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full group ${
                  activeState 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                }`;
              }}
              onClick={(e) => {
                console.log('🔍 NavLink clicked:', item.href);
                console.log('🔍 Current pathname before navigation:', location.pathname);
                console.log('🔍 Event details:', e.type, e.currentTarget);
              }}
            >
              <div className={`p-1 rounded-lg transition-colors ${
                location.pathname === item.href || 
                (item.href === '/dashboard' && (location.pathname === '/' || location.pathname === '/dashboard'))
                  ? 'bg-white/20' 
                  : 'group-hover:bg-gray-100'
              }`}>
                <item.icon className="h-4 w-4 flex-shrink-0" />
              </div>
              <span className="truncate font-medium text-sm">{item.title}</span>
            </NavLink>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};

export default SidebarMenuContent;
