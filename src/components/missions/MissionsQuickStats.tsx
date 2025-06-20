
import React from 'react';
import { Calendar, Clock, Building2 } from 'lucide-react';
import { Trip } from '@/contexts/TripContext';
import MissionStats from './MissionStats';

interface MissionsQuickStatsProps {
  trips: Trip[];
}

const MissionsQuickStats: React.FC<MissionsQuickStatsProps> = ({ trips }) => {
  // Calculate real stats from database
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const todayMissions = trips.filter(trip => {
    const tripDate = new Date(trip.timestamp);
    return tripDate >= startOfToday;
  }).length;

  const thisWeekMissions = trips.filter(trip => {
    const tripDate = new Date(trip.timestamp);
    return tripDate >= startOfWeek;
  }).length;

  const totalVisitedCompanies = new Set(trips.map(trip => trip.company)).size;

  const quickStats = [
    {
      title: 'Missions Aujourd\'hui',
      value: todayMissions,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Cette Semaine',
      value: thisWeekMissions,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      title: 'Entreprises Visitées',
      value: totalVisitedCompanies,
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
  ];

  return <MissionStats quickStats={quickStats} />;
};

export default MissionsQuickStats;
