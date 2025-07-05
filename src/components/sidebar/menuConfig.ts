
import { Home, Truck, Factory, Users, Shield, Bell, AlertTriangle } from 'lucide-react';
import { MenuItem } from './types';

export const createMenuItems = (t: any): MenuItem[] => [
  {
    title: t?.dashboard || 'Dashboard',
    href: '/dashboard',
    icon: Home,
    permission: 'dashboard:read',
  },
  {
    title: t?.companies || 'Companies',
    href: '/companies',
    icon: Factory,
    permission: 'companies:read',
  },
  {
    title: t?.vans || 'Vans',
    href: '/vans',
    icon: Truck,
    permission: 'vans:read',
  },
  {
    title: t?.employees || 'Employees',
    href: '/employees',
    icon: Users,
    permission: 'users:read',
  },
  {
    title: t?.missions || 'Missions',
    href: '/missions',
    icon: Bell,
    permission: 'trips:read',
    indicatorKey: 'activeMissions' as const,
  },
  {
    title: t?.authUsers || 'Auth Users',
    href: '/auth-users',
    icon: Shield,
    permission: 'auth-users:read',
    indicatorKey: 'pendingApprovals' as const,
  },
];

// Add system alerts as a separate item if user is admin
export const createSystemAlertsItem = (t: any, alertCount: number): MenuItem | null => {
  if (alertCount === 0) return null;
  
  return {
    title: t?.systemAlerts || 'System Alerts',
    href: '/dashboard', // Navigate to dashboard to show alerts
    icon: AlertTriangle,
    permission: 'dashboard:read',
    indicatorKey: 'systemAlerts' as const,
    className: 'text-orange-600 hover:text-orange-700',
  };
};
