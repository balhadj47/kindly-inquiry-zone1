
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
} from 'lucide-react';

const MobileBottomNav = () => {
  const { hasPermission, loading, currentUser } = useRBAC();
  const { t } = useLanguage();
  const location = useLocation();

  console.log('📱 MobileBottomNav render - Loading:', loading, 'User:', currentUser?.email);

  const menuItems = [
    {
      title: t.home || 'Home',
      url: '/dashboard',
      icon: Home,
      permission: null,
    },
    {
      title: t.companies || 'Companies',
      url: '/companies',
      icon: Building2,
      permission: 'companies:read',
    },
    {
      title: t.vans || 'Vans',
      url: '/vans',
      icon: Truck,
      permission: 'vans:read',
    },
    {
      title: t.logger || 'Logger',
      url: '/trip-logger',
      icon: MapPin,
      permission: 'trips:read',
    },
    {
      title: t.history || 'History',
      url: '/trip-history',
      icon: Users,
      permission: 'trips:read',
    },
  ];

  // Show loading state
  if (loading) {
    console.log('📱 MobileBottomNav: Showing loading state');
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
        <div className="grid h-16 grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center justify-center px-1 py-2">
              <div className="h-5 w-5 bg-muted rounded animate-pulse mb-1"></div>
              <div className="h-3 w-8 bg-muted rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </nav>
    );
  }

  try {
    const filteredItems = menuItems.filter((item) => {
      if (!item.permission) return true;
      
      try {
        const hasAccess = hasPermission(item.permission);
        console.log(`📱 Mobile item "${item.title}": permission="${item.permission}", access=${hasAccess}`);
        return hasAccess;
      } catch (error) {
        console.error(`❌ Error checking mobile permission for ${item.title}:`, error);
        return false;
      }
    });

    console.log('📱 MobileBottomNav: Filtered items:', filteredItems.length, 'of', menuItems.length);

    // Always show at least home if no other items
    const displayItems = filteredItems.length > 0 ? filteredItems.slice(0, 5) : [menuItems[0]];

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
    console.error('❌ MobileBottomNav: Critical error:', error);
    // Fallback to home only
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
        <div className="grid h-16 grid-cols-1">
          <NavLink
            to="/dashboard"
            className="flex flex-col items-center justify-center px-1 py-2 text-xs text-gray-600"
          >
            <Home className="h-5 w-5 mb-1" />
            <span className="text-[10px] font-medium">Home</span>
          </NavLink>
        </div>
      </nav>
    );
  }
};

export default MobileBottomNav;
