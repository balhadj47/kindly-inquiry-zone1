
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Calendar, Clock, Building2, Truck, Users, MapPin, FileText } from 'lucide-react';
import { useTrip } from '@/contexts/TripContext';
import { useVans } from '@/hooks/useVans';
import { Badge } from '@/components/ui/badge';
import { formatDateOnly } from '@/utils/dateUtils';

const MissionsPage = () => {
  console.log('🚗 MissionsPage: Component rendering...');
  
  const [isNewMissionDialogOpen, setIsNewMissionDialogOpen] = useState(false);
  const { trips, isLoading, error } = useTrip();
  const { vans } = useVans();

  console.log('🚗 MissionsPage: Dialog state:', isNewMissionDialogOpen);
  console.log('🚗 MissionsPage: Trips data:', trips);

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

  console.log('🚗 MissionsPage: Stats calculated:', {
    todayMissions,
    thisWeekMissions,
    totalVisitedCompanies,
  });

  const getVanDisplayName = (vanId: string) => {
    const van = vans.find(v => v.id === vanId);
    if (van) {
      return (van as any).reference_code || van.license_plate || van.model;
    }
    return vanId;
  };

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Erreur</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

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
              <p className="text-gray-600">Gérez vos missions et suivez vos activités en temps réel</p>
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

        {/* Quick Stats Cards */}
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

      {/* Mission List */}
      <div className="bg-white border rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Missions Récentes</h2>
          <p className="text-gray-600 mt-1">Liste de toutes les missions</p>
        </div>
        
        {trips.length === 0 ? (
          <div className="text-center py-12">
            <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune Mission</h3>
            <p className="text-gray-600 mb-6">
              Aucune mission n'a été enregistrée pour le moment.
            </p>
            <Button
              onClick={() => setIsNewMissionDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer une Mission
            </Button>
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-4">
              {trips.slice(0, 10).map((trip) => (
                <Card key={trip.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">
                          {trip.company} - {trip.branch}
                        </h3>
                        <p className="text-sm text-gray-600">{trip.driver}</p>
                      </div>
                      <Badge 
                        variant={trip.status === 'active' ? 'default' : 'secondary'}
                        className={trip.status === 'active' 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                        }
                      >
                        {trip.status === 'active' ? 'En Mission' : 'Terminé'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-gray-500" />
                        <span>{getVanDisplayName(trip.van)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{formatDateOnly(trip.timestamp)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{trip.userIds?.length || 0} utilisateurs</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{trip.startKm} km</span>
                      </div>
                    </div>

                    {trip.notes && (
                      <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                        <FileText className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{trip.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {trips.length > 10 && (
              <div className="mt-6 text-center">
                <Button variant="outline">
                  Voir plus de missions
                </Button>
              </div>
            )}
          </div>
        )}
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
