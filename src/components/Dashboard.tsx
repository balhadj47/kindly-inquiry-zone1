
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSecurePermissions } from '@/hooks/useSecurePermissions';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { calculateDashboardStats, createChartData } from './dashboard/DashboardStats';
import QuickActions from './dashboard/QuickActions';
import SystemStatus from './dashboard/SystemStatus';
import EnhancedChartsSection from './dashboard/EnhancedChartsSection';
import PermissionsDebug from './PermissionsDebug';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { t } = useLanguage();
  const permissions = useSecurePermissions();

  console.log('📊 Dashboard: Rendering with permissions:', {
    canAccessDashboard: permissions.canAccessDashboard,
    isAuthenticated: permissions.isAuthenticated,
    isAdmin: permissions.isAdmin
  });

  // Fetch all necessary data for dashboard
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase.from('users').select('*');
      if (error) throw error;
      return data || [];
    },
    enabled: permissions.canReadUsers,
  });

  const { data: vans = [], isLoading: vansLoading } = useQuery({
    queryKey: ['vans'],
    queryFn: async () => {
      const { data, error } = await supabase.from('vans').select('*');
      if (error) throw error;
      return data || [];
    },
    enabled: permissions.canReadVans,
  });

  const { data: companies = [], isLoading: companiesLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase.from('companies').select('*');
      if (error) throw error;
      return data || [];
    },
    enabled: permissions.canReadCompanies,
  });

  const { data: trips = [], isLoading: tripsLoading } = useQuery({
    queryKey: ['trips'],
    queryFn: async () => {
      const { data, error } = await supabase.from('trips').select('*');
      if (error) throw error;
      return data || [];
    },
    enabled: permissions.canReadTrips,
  });

  const isLoading = usersLoading || vansLoading || companiesLoading || tripsLoading;

  // Calculate dashboard stats and chart data
  const stats = calculateDashboardStats(users, vans, companies, trips);
  const chartData = createChartData(companies, trips);

  // Calculate system status props
  const totalUsers = users.length;
  const activeVans = vans.filter(van => 
    van.status === 'Actif' || 
    van.status === 'Active' || 
    !van.status || 
    van.status === ''
  ).length;
  const totalCompanies = companies.length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

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

      <QuickActions />
      <EnhancedChartsSection chartData={chartData} />
      <SystemStatus 
        totalUsers={totalUsers} 
        activeVans={activeVans} 
        totalCompanies={totalCompanies} 
      />
    </div>
  );
};

export default Dashboard;
