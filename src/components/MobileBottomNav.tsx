
import React, { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { Home, Building2, Car, History, Settings } from 'lucide-react';

const MobileBottomNav = React.memo(() => {
  const location = useLocation();
  const { t } = useLanguage();
  
  // Memoize navigation items to prevent recreation on every render
  const navItems = useMemo(() => [
    {
      to: '#/dashboard',
      icon: Home,
      label: t.home || 'Home',
      isActive: location.pathname === '/' || location.pathname === '/dashboard'
    },
    {
      to: '#/companies',
      icon: Building2,
      label: t.companies || 'Companies',
      isActive: location.pathname.startsWith('/companies')
    },
    {
      to: '#/vans-drivers',
      icon: Car,
      label: t.vans || 'Vehicles',
      isActive: location.pathname.startsWith('/vans')
    },
    {
      to: '#/trip-history',
      icon: History,
      label: t.history || 'History',
      isActive: location.pathname.startsWith('/trip-history')
    },
    {
      to: '#/settings',
      icon: Settings,
      label: t.settings || 'Settings',
      isActive: location.pathname.startsWith('/settings')
    }
  ], [location.pathname, t]);

  console.log('📱 MobileBottomNav: Rendered for hash route', location.pathname);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <a
              key={index}
              href={item.to}
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-lg transition-colors",
                item.isActive
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium truncate">{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
});

MobileBottomNav.displayName = 'MobileBottomNav';

export default MobileBottomNav;
