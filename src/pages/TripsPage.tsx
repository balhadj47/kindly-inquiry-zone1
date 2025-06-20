import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, MapPin, Clock, TrendingUp, Truck } from 'lucide-react';
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

  return (
    <TripHistoryLayout>
      {/* Header Section */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Truck className="w-8 h-8 text-gray-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1 text-gray-900">Gestion des Voyages</h1>
              <p className="text-gray-600">Créez de nouveaux voyages et suivez vos missions en temps réel</p>
            </div>
          </div>
          
          <Button
            onClick={() => {
              console.log('🚗 TripsPage: Opening new trip dialog...');
              setIsNewTripDialogOpen(true);
            }}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouveau Voyage
          </Button>
        </div>

        {/* Stats in header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <stat.icon className="w-6 h-6 text-gray-600" />
                <div>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
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
