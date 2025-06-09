
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useRBAC } from '@/contexts/RBACContext';
import { useVans } from '@/hooks/useVans';
import { useCompanies } from '@/hooks/useCompanies';

const DashboardLoadingSkeleton = () => {
  return (
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
        {Array.from({ length: 2 }).map((_, index) => (
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

      {/* System Status skeleton */}
      <Card className="animate-pulse">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-3 w-40 mt-1" />
              </div>
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Dashboard = () => {
  const { users, loading: usersLoading } = useRBAC();
  const { vans, loading: vansLoading } = useVans();
  const { companies, loading: companiesLoading } = useCompanies();

  // Calculate real statistics
  const activeVans = vans.filter(van => van.status === 'Actif' || !van.status).length;
  const totalUsers = users.length;
  const totalCompanies = companies.length;
  const totalBranches = companies.reduce((sum, company) => sum + company.branches.length, 0);

  // Mock data for charts (to be replaced with real data when trip logging is implemented)
  const dailyTrips = [
    { date: 'Lun', trips: 0 },
    { date: 'Mar', trips: 0 },
    { date: 'Mer', trips: 0 },
    { date: 'Jeu', trips: 0 },
    { date: 'Ven', trips: 0 },
    { date: 'Sam', trips: 0 },
    { date: 'Dim', trips: 0 },
  ];

  const topBranches = companies.length > 0 ? companies.slice(0, 4).map((company, index) => ({
    name: company.name,
    visits: 0, // To be replaced with real trip data
    color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index] || '#3B82F6'
  })) : [
    { name: 'Aucune succursale', visits: 0, color: '#9CA3AF' }
  ];

  const stats = [
    { title: 'Voyages Aujourd\'hui', value: '0', change: '0', color: 'text-green-600' },
    { title: 'Camionnettes Actives', value: activeVans.toString(), change: `${activeVans}`, color: 'text-blue-600' },
    { title: 'Entreprises Servies', value: totalCompanies.toString(), change: `${totalCompanies}`, color: 'text-gray-600' },
    { title: 'Total Succursales', value: totalBranches.toString(), change: `${totalBranches}`, color: 'text-purple-600' },
  ];

  const isLoading = usersLoading || vansLoading || companiesLoading;

  if (isLoading) {
    return <DashboardLoadingSkeleton />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tableau de Bord</h1>
        <p className="text-sm sm:text-base text-gray-500">Bienvenue! Voici un aperçu de votre flotte.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 leading-tight">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className={`text-xs ${stat.color} font-medium mt-1`}>
                Total: {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Daily Trips Chart */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Voyages Quotidiens</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyTrips} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }} 
                />
                <Bar dataKey="trips" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Companies Chart */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Entreprises Principales</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={topBranches}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name }) => name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="visits"
                >
                  {topBranches.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">État du Système</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                  <span className="font-medium text-gray-900 text-sm sm:text-base">Base de Données</span>
                  <span className="text-gray-500 hidden sm:inline">•</span>
                  <span className="text-green-700 text-sm sm:text-base">Connectée</span>
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">
                  {totalUsers} utilisateurs, {activeVans} camionnettes, {totalCompanies} entreprises
                </div>
              </div>
              <div className="text-xs sm:text-sm text-gray-500 flex-shrink-0">Système opérationnel</div>
            </div>
            
            {totalUsers === 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-yellow-50 rounded-lg gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                    <span className="font-medium text-yellow-900 text-sm sm:text-base">Configuration Requise</span>
                  </div>
                  <div className="text-xs sm:text-sm text-yellow-700 mt-1">
                    Ajoutez des utilisateurs et des camionnettes pour commencer
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
