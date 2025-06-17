
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useRBAC } from '@/contexts/RBACContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Home,
  Building2,
  Users,
  Truck,
  MapPin,
  History,
  Settings,
} from 'lucide-react';

const MobileBottomNav = () => {
  const { hasPermission } = useRBAC();
  const { t } = useLanguage();
  const location = useLocation();

  const menuItems = [
    {
      title: t.home,
      url: '/dashboard',
      icon: Home,
      permission: null,
    },
    {
      title: t.companies,
      url: '/companies',
      icon: Building2,
      permission: 'companies:read',
    },
    {
      title: t.vans,
      url: '/vans',
      icon: Truck,
      permission: 'vans:read',
    },
    {
      title: t.logger,
      url: '/trip-logger',
      icon: MapPin,
      permission: 'trips:read',
    },
    {
      title: t.history,
      url: '/trip-history',
      icon: History,
      permission: 'trips:read',
    },
  ];

  try {
    const filteredItems = menuItems.filter(
      (item) => !item.permission || hasPermission(item.permission)
    );

    // Limit to 5 items for better mobile UX and ensure we have at least 1 item
    const displayItems = filteredItems.slice(0, 5);
    
    if (displayItems.length === 0) {
      console.warn('⚠️ MobileBottomNav: No menu items available for current user');
      return null;
    }

    console.log('📱 MobileBottomNav: Rendering', displayItems.length, 'items');

    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
        <div className={`grid h-16 ${
          displayItems.length === 1 ? 'grid-cols-1' :
          displayItems.length === 2 ? 'grid-cols-2' :
          displayItems.length === 3 ? 'grid-cols-3' :
          displayItems.length === 4 ? 'grid-cols-4' :
          'grid-cols-5'
        }`}>
          {displayItems.map((item) => {
            const isActive = location.pathname === item.url || 
              (item.url === '/dashboard' && location.pathname === '/');
            
            return (
              <NavLink
                key={item.title}
                to={item.url}
                className={`flex flex-col items-center justify-center px-1 py-2 text-xs transition-colors ${
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <item.icon 
                  className={`h-5 w-5 mb-1 ${
                    isActive ? 'text-blue-600' : 'text-gray-600'
                  }`} 
                />
                <span className="truncate text-[10px] font-medium">
                  {item.title}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    );
  } catch (error) {
    console.error('❌ MobileBottomNav: Error rendering navigation:', error);
    return null;
  }
};

export default MobileBottomNav;
