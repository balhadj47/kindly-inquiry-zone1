
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Calendar, MapPin, Clock, TrendingUp, Users, Truck } from 'lucide-react';
import TripHistoryContainer from '@/components/trip-history/TripHistoryContainer';
import TripHistoryLayout from '@/components/trip-history/TripHistoryLayout';
import NewTripDialog from '@/components/NewTripDialog';
import { useTrip } from '@/contexts/TripContext';

const TripsPage = () => {
  console.log('🚗 TripsPage: Component rendering...');
  
  const [isNewTripDialogOpen, setIsNewTripDialogOpen] = useState(false);
  const { trips } = useTrip();

  console.log('🚗 TripsPage: Dialog state:', isNewTripDialogOpen);

  // Calculate quick stats
  const activeTrips = trips?.filter(trip => trip.status === 'active')?.length || 0;
  const completedTrips = trips?.filter(trip => trip.status === 'completed')?.length || 0;
  const totalTrips = trips?.length || 0;

  const quickStats = [
    {
      title: 'Voyages Actifs',
      value: activeTrips,
      icon: TrendingUp,
    },
    {
      title: 'Voyages Terminés',
      value: completedTrips,
      icon: Clock,
    },
    {
      title: 'Total Voyages',
      value: totalTrips,
      icon: MapPin,
    },
  ];

  const quickActions = [
    {
      title: 'Planifier',
      description: 'Organisation des missions',
      icon: Calendar,
      color: 'blue',
    },
    {
      title: 'Équipes',
      description: 'Gestion des membres',
      icon: Users,
      color: 'green',
    },
    {
      title: 'Itinéraires',
      description: 'Suivi des trajets',
      icon: MapPin,
      color: 'purple',
    },
    {
      title: 'Rapports',
      description: 'Analyse des données',
      icon: TrendingUp,
      color: 'orange',
    },
  ];

  return (
    <TripHistoryLayout>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Truck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Gestion des Voyages</h1>
              <p className="text-blue-100">Créez de nouveaux voyages et suivez vos missions en temps réel</p>
            </div>
          </div>
          
          <Button
            onClick={() => {
              console.log('🚗 TripsPage: Opening new trip dialog...');
              setIsNewTripDialogOpen(true);
            }}
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouveau Voyage
          </Button>
        </div>

        {/* Stats in header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <stat.icon className="w-6 h-6 text-white" />
                <div>
                  <p className="text-white/80 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickActions.map((action, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  action.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                  action.color === 'green' ? 'bg-green-50 text-green-600' :
                  action.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                  'bg-orange-50 text-orange-600'
                }`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trip History Content */}
      <TripHistoryContainer />

      {/* New Trip Dialog */}
      <NewTripDialog
        isOpen={isNewTripDialogOpen}
        onClose={() => {
          console.log('🚗 TripsPage: Closing new trip dialog...');
          setIsNewTripDialogOpen(false);
        }}
      />
    </TripHistoryLayout>
  );
};

export default TripsPage;
