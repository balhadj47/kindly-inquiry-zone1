
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();
  const { hasPermission } = useRBAC();

  const menuItems = [
    {
      title: t.dashboard,
      href: '/',
      icon: Database,
      permission: 'dashboard.view',
    },
    {
      title: t.companies,
      href: '/companies',
      icon: Building2,
      permission: 'companies.view',
    },
    {
      title: 'Vans',
      href: '/vans',
      icon: Car,
      permission: 'vans.view',
    },
    {
      title: 'Users',
      href: '/users',
      icon: Users,
      permission: 'users.view',
    },
    {
      title: t.logTrip,
      href: '/trip-logger',
      icon: MapIcon,
      permission: 'trips.log',
    },
    {
      title: t.tripHistory,
      href: '/trip-history',
      icon: List,
      permission: 'trips.view',
    },
  ];

  const visibleMenuItems = menuItems.filter(item => hasPermission(item.permission));

  const handleMobileMenuToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleLinkClick = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={handleMobileMenuToggle}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md border border-gray-200"
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300",
        // Desktop behavior
        "hidden lg:block",
        isCollapsed ? "lg:w-16" : "lg:w-64",
        // Mobile behavior
        "lg:translate-x-0",
        isMobileOpen ? "block w-64 translate-x-0" : "block w-64 -translate-x-full lg:translate-x-0"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <h1 className="text-lg sm:text-xl font-bold text-gray-800">Van Fleet</h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Calendar className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="mt-6">
          {visibleMenuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center px-4 py-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors touch-manipulation",
                  isActive && "bg-blue-100 text-blue-600 border-r-2 border-blue-600",
                  isCollapsed && "lg:justify-center lg:px-2"
                )}
              >
                <IconComponent className="h-5 w-5 flex-shrink-0" />
                {(!isCollapsed || isMobileOpen) && <span className="ml-3 text-sm sm:text-base">{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        {(!isCollapsed || isMobileOpen) && (
          <div className="absolute bottom-4 left-4 right-4">
            <LanguageSelector />
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
