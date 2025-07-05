
import { LucideIcon } from 'lucide-react';

export interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
  permission?: string;
  indicatorKey?: 'activeMissions' | 'pendingApprovals' | 'systemAlerts';
  className?: string;
}
