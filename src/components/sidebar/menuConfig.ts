
import { Home, Truck, Factory, Users, Shield, Bell, AlertTriangle } from 'lucide-react';
import { MenuItem } from './types';

export const menuItems: MenuItem[] = [
  {
    title: 'Tableau de Bord',
    href: '/dashboard',
    icon: Home,
    permission: 'canAccessDashboard',
  },
  {
    title: 'Entreprises',
    href: '/companies',
    icon: Factory,
    permission: 'canReadCompanies',
  },
  {
    title: 'Véhicules',
    href: '/vans',
    icon: Truck,
    permission: 'canReadVans',
  },
  {
    title: 'Employés',
    href: '/employees',
    icon: Users,
    permission: 'canReadUsers',
  },
  {
    title: 'Missions',
    href: '/missions',
    icon: Bell,
    permission: 'canReadTrips',
    indicatorKey: 'activeMissions' as const,
  },
  {
    title: 'Auth Users',
    href: '/auth-users',
    icon: Shield,
    permission: 'canReadAuthUsers',
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
    permission: 'canAccessDashboard',
    indicatorKey: 'systemAlerts' as const,
    className: 'text-orange-600 hover:text-orange-700',
  };
};
