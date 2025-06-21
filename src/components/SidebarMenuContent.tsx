
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
    <SidebarMenu className="space-y-1 px-2">
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
                return `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 w-full group relative overflow-hidden ${
                  activeState 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm hover:scale-[1.01]'
                } group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-3 group-data-[collapsible=icon]:mx-1`;
              }}
              onClick={(e) => {
                console.log('🔍 NavLink clicked:', item.href);
                console.log('🔍 Current pathname before navigation:', location.pathname);
                console.log('🔍 Event details:', e.type, e.currentTarget);
              }}
            >
              <div className={`flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                location.pathname === item.href || 
                (item.href === '/dashboard' && (location.pathname === '/' || location.pathname === '/dashboard'))
                  ? 'p-2 rounded-lg bg-white/20 shadow-sm group-data-[collapsible=icon]:p-3 group-data-[collapsible=icon]:rounded-xl group-data-[collapsible=icon]:bg-white/30' 
                  : 'p-2 rounded-lg group-hover:bg-gray-100 group-data-[collapsible=icon]:p-3 group-data-[collapsible=icon]:rounded-xl group-data-[collapsible=icon]:hover:bg-blue-50 group-data-[collapsible=icon]:hover:text-blue-600'
              }`}>
                <item.icon className="h-4 w-4 transition-all duration-300 group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5" />
              </div>
              <span className="truncate font-medium text-sm group-data-[collapsible=icon]:hidden transition-all duration-300">
                {item.title}
              </span>
              
              {/* Enhanced indicator dot for collapsed state */}
              <div className={`hidden group-data-[collapsible=icon]:block absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                location.pathname === item.href || 
                (item.href === '/dashboard' && (location.pathname === '/' || location.pathname === '/dashboard'))
                  ? 'bg-white shadow-lg scale-100' 
                  : 'bg-gray-300 scale-0 group-hover:scale-100 group-hover:bg-blue-400'
              }`} />
            </NavLink>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};

export default SidebarMenuContent;
