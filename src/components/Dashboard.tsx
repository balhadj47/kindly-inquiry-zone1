
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSecurePermissions } from '@/hooks/useSecurePermissions';
import StatsGrid from './dashboard/StatsGrid';
import ChartsSection from './dashboard/ChartsSection';
import QuickActions from './dashboard/QuickActions';
import SystemStatus from './dashboard/SystemStatus';

const Dashboard = () => {
  const { user } = useAuth();
  const permissions = useSecurePermissions();

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
      
      <StatsGrid />
      <QuickActions />
      <ChartsSection />
      <SystemStatus />
    </div>
  );
};

export default Dashboard;
