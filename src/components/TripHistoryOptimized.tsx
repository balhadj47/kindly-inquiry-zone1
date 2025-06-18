
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, MapPin, Truck, Plus, Filter } from 'lucide-react';
import { useTrips } from '@/hooks/trips/useTripsQuery';
import { useTripMutations } from '@/hooks/trips/useTripMutations';
import { format } from 'date-fns';

const TripHistoryLoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <Skeleton className="h-9 w-64 mb-4 md:mb-0" />
      <Skeleton className="h-10 w-32" />
    </div>

    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
      </CardContent>
    </Card>

    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="space-y-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const TripHistoryOptimized = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { data, isLoading, error, refetch } = useTrips(page, 20);
  const { deleteTrip } = useTripMutations();

  if (isLoading) {
    return <TripHistoryLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-4">Impossible de charger l'historique des voyages</p>
          <button 
            onClick={() => refetch()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const trips = data?.trips || [];
  const total = data?.total || 0;

  const filteredTrips = useMemo(() => {
    let filtered = trips.filter(trip => {
      const matchesSearch = trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           trip.van.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (statusFilter === 'active') {
        return matchesSearch && !trip.end_date;
      } else if (statusFilter === 'completed') {
        return matchesSearch && trip.end_date;
      }
      
      return matchesSearch;
    });
    
    return filtered;
  }, [trips, searchTerm, statusFilter]);

  const getStatusColor = (trip: any) => {
    return trip.end_date 
      ? 'bg-green-100 text-green-800' 
      : 'bg-blue-100 text-blue-800';
  };

  const getStatusText = (trip: any) => {
    return trip.end_date ? 'Terminé' : 'En cours';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Historique des Voyages</h1>
        <Button className="mt-4 md:mt-0">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Voyage
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par destination ou camionnette..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les voyages</SelectItem>
                <SelectItem value="active">En cours</SelectItem>
                <SelectItem value="completed">Terminés</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filteredTrips.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun voyage trouvé</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? "Essayez d'ajuster votre recherche ou vos filtres" 
                : "Commencez par créer votre premier voyage"
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTrips.map((trip) => (
            <Card key={trip.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      {trip.destination}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {format(new Date(trip.start_date), 'dd/MM/yyyy à HH:mm')}
                    </p>
                  </div>
                  <Badge className={getStatusColor(trip)}>
                    {getStatusText(trip)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-500">Camionnette:</span>
                    <p className="flex items-center">
                      <Truck className="h-3 w-3 mr-1" />
                      {trip.van}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">KM Début:</span>
                    <p>{trip.start_km.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">KM Fin:</span>
                    <p>{trip.end_km ? trip.end_km.toLocaleString() : 'En cours'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Distance:</span>
                    <p>
                      {trip.end_km 
                        ? `${(trip.end_km - trip.start_km).toLocaleString()} km`
                        : 'En cours'
                      }
                    </p>
                  </div>
                </div>

                {trip.notes && (
                  <div className="mb-4">
                    <span className="font-medium text-gray-500 text-sm">Notes:</span>
                    <p className="text-sm text-gray-700 mt-1">{trip.notes}</p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Voir Détails
                  </Button>
                  {!trip.end_date && (
                    <Button variant="outline" size="sm">
                      Terminer Voyage
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {total > 20 && (
        <div className="flex justify-center">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Précédent
            </Button>
            <span className="flex items-center px-4 py-2 text-sm text-gray-700">
              Page {page} sur {Math.ceil(total / 20)}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(p => p + 1)}
              disabled={page >= Math.ceil(total / 20)}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripHistoryOptimized;
