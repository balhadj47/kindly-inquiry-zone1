
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSecurePermissions } from '@/hooks/useSecurePermissions';
import { useTripsQuery } from '@/hooks/trips/useTripsQuery';
import { useVans } from '@/hooks/useVans';
import { useUsers } from '@/hooks/useUsers';
import { useCompanies } from '@/hooks/useCompanies';
import { calculateDashboardStats, createChartData } from './dashboard/DashboardStats';
import EnhancedStatsGrid from './dashboard/EnhancedStatsGrid';
import EnhancedChartsSection from './dashboard/EnhancedChartsSection';
import QuickActions from './dashboard/QuickActions';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const permissions = useSecurePermissions();
  
  // Fetch data using existing hooks
  const { data: tripsData, isLoading: tripsLoading } = useTripsQuery();
  const { vans, isLoading: vansLoading } = useVans();
  const { users, loading: usersLoading } = useUsers();
  const { data: companies, isLoading: companiesLoading } = useCompanies();

  console.log('🏠 Dashboard: Auth and permission status', {
    authLoading,
    hasUser: !!user,
    isAuthenticated: permissions.isAuthenticated,
    canAccessDashboard: permissions.canAccessDashboard,
    permissionsReady: !authLoading && permissions.isAuthenticated !== undefined
  });

  // Wait for auth to be fully loaded before making permission decisions
  if (authLoading || permissions.isAuthenticated === undefined) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg border animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Only check permissions after auth is fully loaded
  if (!permissions.canAccessDashboard) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h2>
          <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  console.log('🏠 Dashboard: Data status', {
    tripsData: tripsData?.trips?.length || 0,
    vans: vans?.length || 0,
    users: users?.length || 0,
    companies: companies?.length || 0,
    loading: { tripsLoading, vansLoading, usersLoading, companiesLoading }
  });

  // Show loading state while data is being fetched
  const isDataLoading = tripsLoading || vansLoading || usersLoading || companiesLoading;
  
  if (isDataLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
            <p className="text-gray-600">Chargement des données...</p>
          </div>
        </div>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg border animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Extract trips array from the data structure
  const trips = tripsData?.trips || [];
  
  // Calculate enhanced statistics
  const stats = calculateDashboardStats(
    users || [],
    vans || [],
    companies || [],
    trips
  );

  // Create chart data
  const chartData = createChartData(companies || [], trips);

  console.log('🏠 Dashboard: Calculated stats', { stats });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600">Vue d'ensemble de votre système de gestion</p>
        </div>
      </div>
      
      <EnhancedStatsGrid stats={stats} />
      
      <QuickActions />
      
      <EnhancedChartsSection chartData={chartData} />
    </div>
  );
};

export default Dashboard;
