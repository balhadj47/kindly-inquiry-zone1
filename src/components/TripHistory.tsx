import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Users, Truck, Plus } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTrip } from '@/contexts/TripContext';
import TripDetailsDialog from './TripDetailsDialog';
import TripHistoryLoadingSkeleton from './TripHistoryLoadingSkeleton';
import { RefreshButton } from '@/components/ui/refresh-button';

const TripHistory = () => {
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const { trips, loading, error, refreshTrips } = useTrip();

  // Refresh data when component mounts (user enters the page)
  useEffect(() => {
    console.log('🗂️ TripHistory component mounted, refreshing data');
    refreshTrips();
  }, [refreshTrips]);

  const handleRefresh = () => {
    refreshTrips();
  };

  const filteredTrips = useMemo(() => {
    if (!trips) return [];

    let filtered = [...trips];

    if (activeTab !== 'all') {
      filtered = filtered.filter(trip => {
        const now = new Date();
        const endDate = trip.end_date ? new Date(trip.end_date) : null;

        if (activeTab === 'active') {
          return !endDate; // Active trips have no end date
        } else if (activeTab === 'completed') {
          return endDate && endDate <= now; // Completed trips have an end date in the past
        }

        return true;
      });
    }

    return filtered;
  }, [trips, activeTab]);

  const handleTripClick = (trip) => {
    setSelectedTrip(trip);
  };

  const handleCloseDialog = () => {
    setSelectedTrip(null);
  };

  if (loading) {
    return <TripHistoryLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-4">Impossible de charger l'historique des voyages</p>
          <Button onClick={handleRefresh}>Réessayer</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Historique des Voyages</h1>
        <RefreshButton onRefresh={handleRefresh} />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all" onClick={() => setActiveTab('all')}>Tous</TabsTrigger>
          <TabsTrigger value="active" onClick={() => setActiveTab('active')}>En Cours</TabsTrigger>
          <TabsTrigger value="completed" onClick={() => setActiveTab('completed')}>Terminés</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          {filteredTrips.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun voyage trouvé</h3>
                <p className="text-gray-600 mb-4">
                  {activeTab === 'all'
                    ? "Il n'y a aucun voyage enregistré."
                    : `Il n'y a aucun voyage ${activeTab === 'active' ? 'en cours' : 'terminé'}.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrips.map((trip) => {
                const startDate = new Date(trip.start_date);
                const endDate = trip.end_date ? new Date(trip.end_date) : null;
                const timeAgo = formatDistanceToNow(startDate, { addSuffix: true, locale: fr });
                const formattedStartDate = format(startDate, 'dd MMMM yyyy', { locale: fr });
                const formattedStartTime = format(startDate, 'HH:mm');
                const formattedEndDate = endDate ? format(endDate, 'dd MMMM yyyy', { locale: fr }) : 'En cours';
                const formattedEndTime = endDate ? format(endDate, 'HH:mm') : '';

                return (
                  <Card key={trip.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleTripClick(trip)}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg font-medium">{trip.name}</CardTitle>
                          <p className="text-sm text-gray-600"><Calendar className="h-4 w-4 mr-1 inline-block" /> {formattedStartDate}</p>
                        </div>
                        <Badge variant="secondary">
                          {endDate ? 'Terminé' : 'En cours'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm text-gray-600">
                        <p><MapPin className="h-4 w-4 mr-1 inline-block" /> Départ: {trip.start_location}</p>
                        <p><MapPin className="h-4 w-4 mr-1 inline-block" /> Arrivée: {trip.end_location}</p>
                        <p><Clock className="h-4 w-4 mr-1 inline-block" /> Début: {formattedStartTime}</p>
                        {endDate && <p><Clock className="h-4 w-4 mr-1 inline-block" /> Fin: {formattedEndTime}</p>}
                        <p><Users className="h-4 w-4 mr-1 inline-block" /> Passagers: {trip.passengers}</p>
                        <p>
                          <Truck className="h-4 w-4 mr-1 inline-block" />
                          Créé il y a {timeAgo}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <TripDetailsDialog trip={selectedTrip} onClose={handleCloseDialog} />
    </div>
  );
};

export default TripHistory;
