
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSecurePermissions } from '@/hooks/useSecurePermissions';
import StatsGrid from './dashboard/StatsGrid';
import ChartsSection from './dashboard/ChartsSection';
import QuickActions from './dashboard/QuickActions';

const Dashboard = () => {
  const { user } = useAuth();
  const permissions = useSecurePermissions();

  // Default data for dashboard components
  const stats = [
    { title: 'Total des trajets', value: '0', change: '0', color: 'text-blue-600' },
    { title: 'Camionnettes actives', value: '0', change: '0', color: 'text-green-600' },
    { title: 'Entreprises', value: '0', change: '0', color: 'text-purple-600' },
    { title: 'Utilisateurs', value: '0', change: '0', color: 'text-orange-600' }
  ];

  const chartData = {
    dailyTrips: [
      { date: 'Lun', trips: 0 },
      { date: 'Mar', trips: 0 },
      { date: 'Mer', trips: 0 },
      { date: 'Jeu', trips: 0 },
      { date: 'Ven', trips: 0 },
      { date: 'Sam', trips: 0 },
      { date: 'Dim', trips: 0 }
    ],
    topBranches: [
      { name: 'Aucune entreprise', visits: 1, color: '#8884d8' }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600">Vue d'ensemble de votre système de gestion</p>
        </div>
        {permissions.canCreateTrips && (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau trajet
          </Button>
        )}
      </div>
      
      <StatsGrid stats={stats} />
      <QuickActions />
      <ChartsSection chartData={chartData} />
    </div>
  );
};

export default Dashboard;
