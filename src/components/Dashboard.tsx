
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSecurePermissions } from '@/hooks/useSecurePermissions';
import DashboardStats from './dashboard/DashboardStats';
import QuickActions from './dashboard/QuickActions';
import SystemStatus from './dashboard/SystemStatus';
import EnhancedChartsSection from './dashboard/EnhancedChartsSection';
import PermissionsDebug from './PermissionsDebug';

const Dashboard = () => {
  const { t } = useLanguage();
  const permissions = useSecurePermissions();

  console.log('📊 Dashboard: Rendering with permissions:', {
    canAccessDashboard: permissions.canAccessDashboard,
    isAuthenticated: permissions.isAuthenticated,
    isAdmin: permissions.isAdmin
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t.dashboard}</h1>
      </div>

      {/* Temporary Debug Section */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-yellow-800 mb-2">Debug Information</h2>
        <p className="text-sm text-yellow-700 mb-4">This debug section will be removed once permissions are working correctly.</p>
        <PermissionsDebug />
      </div>

      <DashboardStats />
      <QuickActions />
      <EnhancedChartsSection />
      <SystemStatus />
    </div>
  );
};

export default Dashboard;
