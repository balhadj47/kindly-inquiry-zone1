
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
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

const SidebarMenuContent = () => {
  const { hasPermission } = useRBAC();
  const location = useLocation();

  const menuItems = [
    {
      title: 'Tableau de Bord',
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
      title: 'Utilisateurs',
      url: '/users',
      icon: Users,
      permission: 'users:read',
    },
    {
      title: 'Logger Voyage',
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
    {
      title: 'Paramètres',
      url: '/settings',
      icon: Settings,
      permission: null,
    },
  ];

  const filteredItems = menuItems.filter(
    (item) => !item.permission || hasPermission(item.permission)
  );

  return (
    <SidebarMenu>
      {filteredItems.map((item) => {
        const isActive = location.pathname === item.url || 
          (item.url === '/dashboard' && location.pathname === '/');
        
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={isActive}>
              <NavLink
                to={item.url}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{item.title}</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};

export default SidebarMenuContent;
