import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, MapPin, Clock, TrendingUp, Truck, Calendar, Building2 } from 'lucide-react';
import TripHistoryContainer from '@/components/trip-history/TripHistoryContainer';
import TripHistoryLayout from '@/components/trip-history/TripHistoryLayout';
import NewTripDialog from '@/components/NewTripDialog';
import { useTrip } from '@/contexts/TripContext';

const MissionsPage = () => {
  console.log('🚗 MissionsPage: Component rendering...');
  
  const [isNewTripDialogOpen, setIsNewTripDialogOpen] = useState(false);
  const { trips, isLoading } = useTrip();

  console.log('🚗 MissionsPage: Dialog state:', isNewTripDialogOpen);
  console.log('🚗 MissionsPage: Trips data:', trips);
  console.log('🚗 MissionsPage: Is loading:', isLoading);

  // Calculate stats based on TripHistoryStats logic
  const todayTrips = trips?.filter(trip => {
    const tripDate = new Date(trip.timestamp).toDateString();
    const today = new Date().toDateString();
    return tripDate === today;
  }).length || 0;

  const thisWeekTrips = trips?.filter(trip => {
    const tripDate = new Date(trip.timestamp);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return tripDate >= weekAgo;
  }).length || 0;

  const totalVisitedCompanies = new Set(trips?.map(trip => trip.company)).size || 0;

  console.log('🚗 MissionsPage: Stats calculated:', {
    todayTrips,
    thisWeekTrips,
    totalVisitedCompanies,
    totalTrips: trips?.length || 0
  });

  const quickStats = [
    {
      title: 'Missions Aujourd\'hui',
      value: todayTrips,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Cette Semaine',
      value: thisWeekTrips,
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
    <TripHistoryLayout>
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
              setIsNewTripDialogOpen(true);
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

        {/* Debug info for development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
            <strong>Debug Info:</strong> Total trips: {trips?.length || 0}, Loading: {isLoading ? 'Yes' : 'No'}
          </div>
        )}
      </div>

      {/* Trip History Content */}
      <TripHistoryContainer />

      {/* New Trip Dialog */}
      <NewTripDialog
        isOpen={isNewTripDialogOpen}
        onClose={() => {
          console.log('🚗 MissionsPage: Closing new mission dialog...');
          setIsNewTripDialogOpen(false);
        }}
      />
    </TripHistoryLayout>
  );
};

export default MissionsPage;
