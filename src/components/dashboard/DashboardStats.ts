
import { Trip } from '@/contexts/trip/types';

interface User {
  id: string | number;
  name: string;
  status?: string;
}

interface Van {
  id: string;
  status?: string;
  model?: string;
  reference_code?: string;
}

interface Company {
  id: string;
  name: string;
}

export const calculateDashboardStats = (
  users: User[],
  vans: Van[],
  companies: Company[],
  trips: Trip[]
) => {
  console.log('📊 calculateDashboardStats: Input data', {
    usersCount: users?.length || 0,
    vansCount: vans?.length || 0,
    companiesCount: companies?.length || 0,
    tripsCount: trips?.length || 0
  });

  // Calculate active vans (those with status 'Active', 'Actif' or no status)
  const activeVans = vans.filter(van => 
    van.status === 'Active' || 
    van.status === 'Actif' || 
    !van.status || 
    van.status === ''
  ).length;

  // Calculate today's trips
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  
  const todaysTrips = trips.filter(trip => {
    if (!trip.timestamp && !trip.created_at) return false;
    const tripDate = (trip.timestamp || trip.created_at || '').split('T')[0];
    return tripDate === todayString;
  }).length;

  // Calculate yesterday's trips for comparison
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split('T')[0];
  
  const yesterdaysTrips = trips.filter(trip => {
    if (!trip.timestamp && !trip.created_at) return false;
    const tripDate = (trip.timestamp || trip.created_at || '').split('T')[0];
    return tripDate === yesterdayString;
  }).length;

  // Calculate trend for today's trips
  const tripsChange = yesterdaysTrips > 0 
    ? Math.round(((todaysTrips - yesterdaysTrips) / yesterdaysTrips) * 100)
    : todaysTrips > 0 ? 100 : 0;

  // Calculate active trips (those with status 'active' or no end data)
  const activeTrips = trips.filter(trip => 
    trip.status === 'active' || 
    trip.status === 'in_progress' ||
    (!trip.endKm && !trip.end_km)
  ).length;

  // Calculate total kilometers driven today
  const todaysCompletedTrips = trips.filter(trip => {
    if (!trip.timestamp && !trip.created_at) return false;
    const tripDate = (trip.timestamp || trip.created_at || '').split('T')[0];
    const hasEndKm = trip.endKm || trip.end_km;
    const hasStartKm = trip.startKm || trip.start_km;
    return tripDate === todayString && hasEndKm && hasStartKm;
  });
  
  const totalKmToday = todaysCompletedTrips.reduce((sum, trip) => {
    const endKm = trip.endKm || trip.end_km || 0;
    const startKm = trip.startKm || trip.start_km || 0;
    return sum + (endKm - startKm);
  }, 0);

  // Calculate utilization rate (active vans / total vans)
  const utilizationRate = vans.length > 0 ? Math.round((activeVans / vans.length) * 100) : 0;

  const stats = [
    { 
      title: 'Voyages Aujourd\'hui', 
      value: todaysTrips.toString(), 
      change: tripsChange > 0 ? `+${tripsChange}%` : `${tripsChange}%`,
      trend: (tripsChange >= 0 ? 'up' : 'down') as 'up' | 'down' | 'neutral',
      color: tripsChange >= 0 ? 'text-green-600' : 'text-red-600',
      icon: 'calendar' as const
    },
    { 
      title: 'Voyages Actifs', 
      value: activeTrips.toString(), 
      change: `En cours`,
      trend: 'neutral' as 'up' | 'down' | 'neutral',
      color: 'text-blue-600',
      icon: 'truck' as const
    },
    { 
      title: 'Taux d\'Utilisation', 
      value: `${utilizationRate}%`, 
      change: `${activeVans}/${vans.length} camionnettes`,
      trend: (utilizationRate >= 70 ? 'up' : utilizationRate >= 50 ? 'neutral' : 'down') as 'up' | 'down' | 'neutral',
      color: utilizationRate >= 70 ? 'text-green-600' : utilizationRate >= 50 ? 'text-yellow-600' : 'text-red-600',
      icon: 'gauge' as const
    },
    { 
      title: 'Kilomètres Aujourd\'hui', 
      value: `${totalKmToday} km`, 
      change: `${todaysCompletedTrips.length} voyages terminés`,
      trend: 'neutral' as 'up' | 'down' | 'neutral',
      color: 'text-purple-600',
      icon: 'map' as const
    },
  ];

  console.log('📊 calculateDashboardStats: Final stats', stats);
  return stats;
};

export const createChartData = (companies: Company[], trips: Trip[]) => {
  // Calculate daily trips for the past week
  const dailyTrips = [];
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    const dayName = days[date.getDay()];
    
    const tripsCount = trips.filter(trip => {
      const tripDate = (trip.timestamp || trip.created_at || '').split('T')[0];
      return tripDate === dateString;
    }).length;
    
    const completedTrips = trips.filter(trip => {
      const tripDate = (trip.timestamp || trip.created_at || '').split('T')[0];
      const hasEnd = trip.endKm || trip.end_km;
      return tripDate === dateString && hasEnd;
    }).length;
    
    dailyTrips.push({ 
      date: dayName, 
      trips: tripsCount,
      completed: completedTrips,
      active: tripsCount - completedTrips
    });
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
    .slice(0, 5)
    .map(([company, visits], index) => ({
      name: company,
      visits,
      color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index] || '#3B82F6'
    }));

  if (topBranches.length === 0) {
    topBranches.push({ name: 'Aucune donnée', visits: 0, color: '#9CA3AF' });
  }

  // Calculate van utilization data
  const vanUsage = new Map();
  trips.forEach(trip => {
    if (trip.van) {
      vanUsage.set(trip.van, (vanUsage.get(trip.van) || 0) + 1);
    }
  });

  const vanUtilization = Array.from(vanUsage.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([van, tripCount]) => ({
      van: van.length > 15 ? van.substring(0, 15) + '...' : van,
      trips: tripCount
    }));

  return { dailyTrips, topBranches, vanUtilization };
};
