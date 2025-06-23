
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useSidebarMenuItems } from './SidebarMenuItems';
import { Home } from 'lucide-react';

// Absolute fallback menu items if everything else fails
const emergencyFallbackItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
];

const SidebarMenuContent = () => {
  console.log('🔍 SidebarMenuContent: Starting render');
  
  const location = useLocation();
  
  let menuItems;
  try {
    menuItems = useSidebarMenuItems();
    console.log('🔍 SidebarMenuContent: Successfully got menu items:', menuItems?.length);
  } catch (error) {
    console.error('🔍 SidebarMenuContent: Error getting menu items, using emergency fallback:', error);
    menuItems = emergencyFallbackItems;
  }

  // Ensure we always have at least basic menu items
  if (!menuItems || menuItems.length === 0) {
    console.log('🔍 SidebarMenuContent: No menu items available, using emergency fallback');
    menuItems = emergencyFallbackItems;
  }
  
  console.log('🔍 SidebarMenuContent: Current location:', location.pathname);
  console.log('🔍 SidebarMenuContent: Final menu items to render:', menuItems.length);

  return (
    <SidebarMenu className="space-y-2">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.href || 
          (item.href === '/dashboard' && (location.pathname === '/' || location.pathname === '/dashboard'));
        
        console.log(`🔍 SidebarMenuContent: Rendering menu item: ${item.title}, href: ${item.href}, active: ${isActive}`);
        
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
                console.log('🔍 SidebarMenuContent: NavLink clicked:', item.href);
                console.log('🔍 SidebarMenuContent: Current pathname before navigation:', location.pathname);
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
