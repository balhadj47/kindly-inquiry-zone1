
import { Trip } from '@/contexts/trip/types';

export const calculateDashboardStats = (
  users: any[],
  vans: any[],
  companies: any[],
  trips: Trip[]
) => {
  // Calculate active vans (those with status 'Actif' or undefined/null status)
  const activeVans = vans.filter(van => 
    van.status === 'Actif' || 
    van.status === 'Active' || 
    !van.status || 
    van.status === ''
  ).length;

  // Calculate today's trips
  const today = new Date().toISOString().split('T')[0];
  const todaysTrips = trips.filter(trip => {
    const tripDate = trip.timestamp ? trip.timestamp.split('T')[0] : '';
    return tripDate === today;
  }).length;

  const totalUsers = users.length;
  const totalCompanies = companies.length;
  const totalBranches = companies.reduce((sum, company) => sum + (company.branches?.length || 0), 0);

  return [
    { 
      title: 'Voyages Aujourd\'hui', 
      value: todaysTrips.toString(), 
      change: `${todaysTrips}`, 
      color: 'text-green-600' 
    },
    { 
      title: 'Camionnettes Actives', 
      value: activeVans.toString(), 
      change: `${activeVans}`, 
      color: 'text-blue-600' 
    },
    { 
      title: 'Entreprises Servies', 
      value: totalCompanies.toString(), 
      change: `${totalCompanies}`, 
      color: 'text-gray-600' 
    },
    { 
      title: 'Total Succursales', 
      value: totalBranches.toString(), 
      change: `${totalBranches}`, 
      color: 'text-purple-600' 
    },
  ];
};

export const createChartData = (companies: any[], trips: Trip[]) => {
  // Calculate daily trips for the past week
  const dailyTrips = [];
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    const dayName = days[date.getDay()];
    
    const tripsCount = trips.filter(trip => {
      const tripDate = trip.timestamp ? trip.timestamp.split('T')[0] : '';
      return tripDate === dateString;
    }).length;
    
    dailyTrips.push({ date: dayName, trips: tripsCount });
  }

  // Calculate top companies by trip count
  const companyTripCounts = new Map();
  trips.forEach(trip => {
    if (trip.company) {
      companyTripCounts.set(trip.company, (companyTripCounts.get(trip.company) || 0) + 1);
    }
  });

  const topBranches = Array.from(companyTripCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([company, visits], index) => ({
      name: company,
      visits,
      color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index] || '#3B82F6'
    }));

  if (topBranches.length === 0) {
    topBranches.push({ name: 'Aucune donnée', visits: 0, color: '#9CA3AF' });
  }

  return { dailyTrips, topBranches };
};
