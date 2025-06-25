
import React, { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useRBAC } from '@/contexts/RBACContext';
import { useVans } from '@/hooks/useVans';
import { useCompanies } from '@/hooks/useCompanies';
import { useTrip } from '@/contexts/TripContext';
import EnhancedStatsGrid from './dashboard/EnhancedStatsGrid';
import EnhancedChartsSection from './dashboard/EnhancedChartsSection';
import QuickActions from './dashboard/QuickActions';
import { calculateDashboardStats, createChartData } from './dashboard/DashboardStats';

const DashboardLoadingSkeleton = () => (
  <div className="space-y-4 sm:space-y-6">
    {/* Header skeleton */}
    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-64" />
    </div>

    {/* Stats Grid skeleton */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Charts Row skeleton */}
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[250px] w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const Dashboard = () => {
  console.log('📊 Dashboard: Component starting to render');
  
  const { users } = useRBAC();
  const { vans, isLoading: vansLoading, refetch: refetchVans, error: vansError } = useVans();
  const { companies, refetch: refetchCompanies, error: companiesError } = useCompanies();
  const { trips } = useTrip();

  console.log('📊 Dashboard: Data state with errors:', {
    users: users?.length || 'null/undefined',
    vans: vans?.length || 'null/undefined', 
    companies: companies?.length || 'null/undefined',
    trips: trips?.length || 'null/undefined',
    vansLoading,
    vansError: vansError || 'none',
    companiesError: companiesError || 'none',
    timestamp: new Date().toISOString()
  });

  // Single refresh effect - only run once when component mounts
  useEffect(() => {
    console.log('📊 Dashboard component mounted, initial data load');
    // Let React Query handle the initial fetch - no manual refresh needed
  }, []); // Empty dependency array - only run once

  const handleRefresh = async () => {
    console.log('📊 Manual refresh triggered');
    try {
      await Promise.all([
        refetchVans?.(),
        refetchCompanies?.()
      ]);
      console.log('📊 Manual refresh completed successfully');
    } catch (error) {
      console.error('📊 Manual refresh failed:', error);
    }
  };

  const isLoading = vansLoading;

  console.log('📊 Dashboard: Render decision - isLoading:', isLoading);

  // Helper function to get error message safely
  const getErrorMessage = (error: unknown): string => {
    if (!error) return '';
    if (typeof error === 'string') return error;
    if (typeof error === 'object' && error !== null && 'message' in error) {
      return String(error.message);
    }
    return '';
  };

  // Show error state if there are critical errors
  if (vansError || companiesError) {
    console.log('📊 Dashboard: Showing error state');
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tableau de Bord</h1>
            <p className="text-sm sm:text-base text-red-600">Erreur de chargement des données</p>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="icon" className="bg-black text-white hover:bg-gray-800 border-black">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        
        <Card className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 mb-4">
              {getErrorMessage(vansError) || getErrorMessage(companiesError) || 'Une erreur est survenue lors du chargement des données'}
            </p>
            <Button onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    console.log('📊 Dashboard: Showing loading skeleton');
    return <DashboardLoadingSkeleton />;
  }

  console.log('📊 Dashboard: Calculating stats and rendering main content');

  try {
    const stats = calculateDashboardStats(users, vans, companies, trips);
    const chartData = createChartData(companies, trips);

    console.log('📊 Dashboard: Stats calculated successfully:', stats);
    console.log('📊 Dashboard: Chart data created successfully:', Object.keys(chartData));

    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tableau de Bord</h1>
            <p className="text-sm sm:text-base text-gray-500">Bienvenue! Voici un aperçu de votre flotte.</p>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="icon" className="bg-black text-white hover:bg-gray-800 border-black">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <EnhancedStatsGrid stats={stats} />
        <QuickActions />
        <EnhancedChartsSection chartData={chartData} />
      </div>
    );
  } catch (error) {
    console.error('📊 Dashboard: Error calculating stats or chart data:', error);
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tableau de Bord</h1>
            <p className="text-sm sm:text-base text-red-600">Erreur de calcul des statistiques</p>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="icon" className="bg-black text-white hover:bg-gray-800 border-black">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        
        <Card className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de traitement</h3>
            <p className="text-gray-600 mb-4">Impossible de calculer les statistiques du tableau de bord</p>
            <Button onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </div>
        </Card>
      </div>
    );
  }
};

export default Dashboard;
