
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Calendar, 
  Company, 
  Database, 
  List, 
  Map as MapIcon,
  User
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/',
      icon: Database,
    },
    {
      title: 'Companies',
      href: '/companies',
      icon: Company,
    },
    {
      title: 'Vans & Drivers',
      href: '/vans',
      icon: User,
    },
    {
      title: 'Log Trip',
      href: '/trip-logger',
      icon: MapIcon,
    },
    {
      title: 'Trip History',
      href: '/trip-history',
      icon: List,
    },
  ];

  return (
    <div className={cn(
      "fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-gray-800">Van Fleet</h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Calendar className="h-5 w-5" />
        </button>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors",
                isActive && "bg-blue-100 text-blue-600 border-r-2 border-blue-600",
                isCollapsed && "justify-center px-2"
              )}
            >
              <IconComponent className="h-5 w-5" />
              {!isCollapsed && <span className="ml-3">{item.title}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
