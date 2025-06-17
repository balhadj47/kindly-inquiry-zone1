
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useRBAC } from '@/contexts/RBACContext';
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
  const location = useLocation();

  const menuItems = [
    {
      title: 'Accueil',
      url: '/dashboard',
      icon: Home,
      permission: null,
    },
    {
      title: 'Entreprises',
      url: '/companies',
      icon: Building2,
      permission: 'companies:read',
    },
    {
      title: 'Camionnettes',
      url: '/vans',
      icon: Truck,
      permission: 'vans:read',
    },
    {
      title: 'Logger',
      url: '/trip-logger',
      icon: MapPin,
      permission: 'trips:read',
    },
    {
      title: 'Historique',
      url: '/trip-history',
      icon: History,
      permission: 'trips:read',
    },
  ];

  const filteredItems = menuItems.filter(
    (item) => !item.permission || hasPermission(item.permission)
  );

  // Limit to 5 items for better mobile UX
  const displayItems = filteredItems.slice(0, 5);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="grid grid-cols-5 h-16">
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
};

export default MobileBottomNav;
