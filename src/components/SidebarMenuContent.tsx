
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useSidebarMenuItems } from './SidebarMenuItems';
import { Home, Settings } from 'lucide-react';

// Fallback menu items when permissions aren't working
const fallbackMenuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

const SidebarMenuContent = () => {
  console.log('🔍 SidebarMenuContent: Starting render');
  
  const location = useLocation();
  
  let menuItems;
  try {
    menuItems = useSidebarMenuItems();
    console.log('🔍 Menu items from useSidebarMenuItems:', menuItems.length);
  } catch (error) {
    console.error('🔍 Error getting menu items, using fallback:', error);
    menuItems = fallbackMenuItems;
  }

  // If no menu items or very few, use fallback
  if (!menuItems || menuItems.length < 2) {
    console.log('🔍 Using fallback menu items due to insufficient items');
    menuItems = fallbackMenuItems;
  }
  
  console.log('🔍 Current location:', location.pathname);
  console.log('🔍 Final menu items to render:', menuItems.length);

  return (
    <SidebarMenu className="space-y-2">
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
                return `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 w-full group relative ${
                  activeState 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-3 group-data-[collapsible=icon]:py-3`;
              }}
              onClick={(e) => {
                console.log('🔍 NavLink clicked:', item.href);
                console.log('🔍 Current pathname before navigation:', location.pathname);
                console.log('🔍 Event details:', e.type, e.currentTarget);
              }}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium text-sm group-data-[collapsible=icon]:sr-only">
                {item.title}
              </span>
              {/* Tooltip for collapsed state */}
              <div className="hidden group-data-[collapsible=icon]:block absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg">
                {item.title}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            </NavLink>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};

export default SidebarMenuContent;
