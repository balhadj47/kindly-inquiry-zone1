
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Calendar, 
  Building2, 
  Database, 
  List, 
  Map as MapIcon,
  Car,
  Users,
  Menu,
  X
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRBAC } from '@/contexts/RBACContext';
import LanguageSelector from './LanguageSelector';

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();
  const { hasPermission, currentUser, groups, loading } = useRBAC();

  console.log('Sidebar render - currentUser:', currentUser);
  console.log('Sidebar render - groups:', groups);
  console.log('Sidebar render - loading:', loading);

  const menuItems = [
    {
      title: t.dashboard,
      href: '/',
      icon: Database,
      permission: 'dashboard.view',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
    },
    {
      title: t.companies,
      href: '/companies',
      icon: Building2,
      permission: 'companies.view',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
    },
    {
      title: 'Vans',
      href: '/vans',
      icon: Car,
      permission: 'vans.view',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
    },
    {
      title: 'Users',
      href: '/users',
      icon: Users,
      permission: 'users.view',
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
    },
    {
      title: t.logTrip,
      href: '/trip-logger',
      icon: MapIcon,
      permission: 'trips.log',
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
    },
    {
      title: t.tripHistory,
      href: '/trip-history',
      icon: List,
      permission: 'trips.view',
      color: 'bg-indigo-500',
      hoverColor: 'hover:bg-indigo-600',
    },
  ];

  // Debug permissions for each menu item
  menuItems.forEach(item => {
    const permission = hasPermission(item.permission);
    console.log(`Permission for ${item.title} (${item.permission}):`, permission);
  });

  const visibleMenuItems = menuItems.filter(item => {
    const permission = hasPermission(item.permission);
    console.log(`Filtering ${item.title}: has permission = ${permission}`);
    return permission;
  });

  console.log('Visible menu items:', visibleMenuItems);

  const handleMobileMenuToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleLinkClick = () => {
    setIsMobileOpen(false);
  };

  if (loading) {
    return (
      <div className="fixed top-0 left-0 right-0 z-40 h-16 bg-white border-b border-gray-200">
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 h-16 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="flex items-center justify-between h-full px-4">
          {/* Brand Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">Van Fleet</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {/* Show debug info when no visible items */}
            {visibleMenuItems.length === 0 && (
              <div className="px-4 py-2 text-sm text-red-600">
                <div>No menu items visible</div>
                <div>User: {currentUser?.name || 'None'}</div>
                <div>Group: {currentUser?.groupId || 'None'}</div>
                <div>Groups loaded: {groups.length}</div>
              </div>
            )}
            
            {visibleMenuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "group relative flex items-center px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105",
                    isActive 
                      ? "bg-white shadow-md border border-gray-200" 
                      : "hover:bg-white hover:shadow-sm"
                  )}
                >
                  {/* Icon background circle */}
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-lg mr-2 transition-colors duration-200",
                    isActive 
                      ? cn(item.color, "text-white shadow-sm") 
                      : cn("bg-gray-200 text-gray-600 group-hover:bg-gray-300")
                  )}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-t-full"></div>
                  )}
                  
                  {/* Text content */}
                  <span className={cn(
                    "text-sm font-medium transition-colors duration-200",
                    isActive ? "text-gray-900" : "text-gray-700 group-hover:text-gray-900"
                  )}>
                    {item.title}
                  </span>
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                </Link>
              );
            })}
          </nav>

          {/* Right side - Language Selector */}
          <div className="hidden md:block">
            <LanguageSelector />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={handleMobileMenuToggle}
            className="md:hidden p-2 rounded-lg bg-white shadow-sm border border-gray-200"
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <nav className="p-4 space-y-2">
              {visibleMenuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={handleLinkClick}
                    className={cn(
                      "group relative flex items-center p-3 rounded-xl transition-all duration-200",
                      isActive 
                        ? "bg-gray-50 shadow-sm border border-gray-200" 
                        : "hover:bg-gray-50"
                    )}
                  >
                    {/* Icon background circle */}
                    <div className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-200",
                      isActive 
                        ? cn(item.color, "text-white shadow-md") 
                        : cn("bg-gray-200 text-gray-600 group-hover:bg-gray-300")
                    )}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    
                    {/* Text content */}
                    <div className="ml-4 flex-1">
                      <span className={cn(
                        "text-sm font-medium transition-colors duration-200",
                        isActive ? "text-gray-900" : "text-gray-700 group-hover:text-gray-900"
                      )}>
                        {item.title}
                      </span>
                    </div>
                  </Link>
                );
              })}
              
              {/* Mobile Language Selector */}
              <div className="pt-4 border-t border-gray-200">
                <LanguageSelector />
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
