
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, MapPin, Clock, TrendingUp, Truck, Calendar, Building2 } from 'lucide-react';

const MissionsPage = () => {
  console.log('🚗 MissionsPage: Component rendering...');
  
  const [isNewMissionDialogOpen, setIsNewMissionDialogOpen] = useState(false);

  console.log('🚗 MissionsPage: Dialog state:', isNewMissionDialogOpen);

  // Mock data for now since we're not using trip context
  const todayMissions = 0;
  const thisWeekMissions = 4;
  const totalVisitedCompanies = 3;

  console.log('🚗 MissionsPage: Stats calculated:', {
    todayMissions,
    thisWeekMissions,
    totalVisitedCompanies,
  });

  const quickStats = [
    {
      title: 'Missions Aujourd\'hui',
      value: todayMissions,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Cette Semaine',
      value: thisWeekMissions,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Entreprises Visitées',
      value: totalVisitedCompanies,
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section with integrated Mission Stats */}
      <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Truck className="w-8 h-8 text-gray-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1 text-gray-900">Gestion des Missions</h1>
              <p className="text-gray-600">Créez de nouvelles missions et suivez vos activités en temps réel</p>
            </div>
          </div>
          
          <Button
            onClick={() => {
              console.log('🚗 MissionsPage: Opening new mission dialog...');
              setIsNewMissionDialogOpen(true);
            }}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouvelle Mission
          </Button>
        </div>

        {/* Quick Stats Cards - Enhanced visibility */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickStats.map((stat, index) => (
            <Card key={index} className="border-2 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Mission Content Area */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <div className="text-center py-12">
          <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Missions</h3>
          <p className="text-gray-600 mb-6">
            Gérez vos missions et suivez leur progression ici.
          </p>
          <Button
            onClick={() => setIsNewMissionDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer une Mission
          </Button>
        </div>
      </div>

      {/* Simple dialog placeholder */}
      {isNewMissionDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Nouvelle Mission</h2>
            <p className="text-gray-600 mb-6">
              Fonctionnalité en cours de développement...
            </p>
            <Button
              onClick={() => {
                console.log('🚗 MissionsPage: Closing new mission dialog...');
                setIsNewMissionDialogOpen(false);
              }}
              className="w-full"
            >
              Fermer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionsPage;
