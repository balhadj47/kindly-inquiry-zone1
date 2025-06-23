import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Dashboard, Users, Truck, Factory, Settings, Clock, Shield } from 'lucide-react';

import { SidebarMenuItem } from "@/components/ui/sidebar-menu-item"
import { SidebarMenuButton } from "@/components/ui/sidebar-menu-button"

const SidebarMenuItems: React.FC = () => {
  const location = useLocation();

  const getNavClass = ({ isActive }: { isActive: boolean }) => {
    return isActive
      ? "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=open]:bg-secondary hover:bg-secondary/80 p-2 bg-secondary text-secondary-foreground"
      : "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=open]:bg-secondary hover:bg-secondary/80 p-2";
  };

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <NavLink to="/" className={getNavClass}>
            <Dashboard className="mr-2 h-4 w-4" />
            Dashboard
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <NavLink to="/companies" className={getNavClass}>
            <Factory className="mr-2 h-4 w-4" />
            Companies
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <NavLink to="/vans-drivers" className={getNavClass}>
            <Truck className="mr-2 h-4 w-4" />
            Vans & Drivers
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <NavLink to="/users" className={getNavClass}>
            <Users className="mr-2 h-4 w-4" />
            Users
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <NavLink to="/auth-users" className={getNavClass}>
            <Shield className="mr-2 h-4 w-4" />
            Auth Users
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <NavLink to="/log-trip" className={getNavClass}>
            <Clock className="mr-2 h-4 w-4" />
            Log Mission
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <NavLink to="/trip-history" className={getNavClass}>
            <Clock className="mr-2 h-4 w-4" />
            Mission History
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <NavLink to="/settings" className={getNavClass}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </>
  );
};

export default SidebarMenuItems;
