
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
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Voyages Terminés',
      value: completedTrips,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Voyages',
      value: totalTrips,
      icon: MapPin,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <TripHistoryLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="relative p-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Truck className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">Gestion des Voyages</h1>
                  <p className="text-blue-100 text-lg">
                    Créez de nouveaux voyages et suivez vos missions en temps réel
                  </p>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {quickStats.map((stat, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${stat.bgColor.replace(/bg-/, 'bg-white/')}/20`}>
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white/80 text-sm">{stat.title}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="flex-shrink-0">
              <Button
                onClick={() => {
                  console.log('🚗 TripsPage: Opening new trip dialog...');
                  setIsNewTripDialogOpen(true);
                }}
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8 py-4 h-auto shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
              >
                <Plus className="w-6 h-6 mr-3" />
                Nouveau Voyage
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Planifier</h3>
                <p className="text-sm text-gray-600">Organisation des missions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Équipes</h3>
                <p className="text-sm text-gray-600">Gestion des membres</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Itinéraires</h3>
                <p className="text-sm text-gray-600">Suivi des trajets</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Rapports</h3>
                <p className="text-sm text-gray-600">Analyse des données</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
