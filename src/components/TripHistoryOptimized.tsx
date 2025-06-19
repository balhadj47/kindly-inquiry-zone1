import React, { useState, useMemo } from 'react';
import { Search, Download, Calendar, Clock, Building2, Truck, Users, MapPin, FileText, Trash2, CheckCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTrip } from '@/contexts/TripContext';
import TripHistoryOptimizedSkeleton from './trip-history/TripHistoryOptimizedSkeleton';
import TripDetailsDialog from './TripDetailsDialog';
import TripEndDialog from './trip-history/TripEndDialog';
import TripDeleteDialog from './trip-history/TripDeleteDialog';
import { useVans } from '@/hooks/useVans';
import { useCompanies } from '@/hooks/useCompanies';
import { formatDateOnly } from '@/utils/dateUtils';
import { useIsMobile } from '@/hooks/use-mobile';

const TripHistoryOptimized = () => {
  console.log('🗂️ TripHistoryOptimized: Component rendering...');

  // State management
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [tripToEnd, setTripToEnd] = useState(null);
  const [tripToDelete, setTripToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [vanFilter, setVanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deletingTripId, setDeletingTripId] = useState(null);

  // Data fetching from context
  const { trips, isLoading, error, deleteTrip } = useTrip();
  const { vans } = useVans();
  const { companies } = useCompanies();
  const isMobile = useIsMobile();
  
  console.log('🗂️ TripHistoryOptimized: Raw trips data:', trips);

  // Process trips data to handle complex date structures
  const processedTrips = useMemo(() => {
    if (!Array.isArray(trips)) {
      console.warn('🗂️ TripHistoryOptimized: trips is not an array:', trips);
      return [];
    }

    return trips.map(trip => {
      try {
        if (!trip) {
          console.warn('🗂️ TripHistoryOptimized: Found null trip');
          return null;
        }

        // Handle complex date structures
        const processDate = (dateObj) => {
          if (!dateObj) return null;
          
          try {
            if (dateObj._type === 'Date' && dateObj.value) {
              if (dateObj.value.iso) {
                return dateObj.value.iso;
              }
              if (dateObj.value.value && typeof dateObj.value.value === 'number') {
                return new Date(dateObj.value.value).toISOString();
              }
            }
            
            if (typeof dateObj === 'string') {
              return dateObj;
            }
            
            if (dateObj instanceof Date) {
              return dateObj.toISOString();
            }
            
            if (typeof dateObj === 'number') {
              return new Date(dateObj).toISOString();
            }
            
            return null;
          } catch (err) {
            console.warn('🗂️ TripHistoryOptimized: Error processing individual date:', err, dateObj);
            return null;
          }
        };

        const processedTrip = {
          ...trip,
          startDate: processDate(trip.startDate),
          endDate: processDate(trip.endDate)
        };

        return processedTrip;
      } catch (dateError) {
        console.error('🗂️ TripHistoryOptimized: Error processing trip dates:', dateError, trip);
        return {
          ...trip,
          startDate: null,
          endDate: null
        };
      }
    }).filter(Boolean);
  }, [trips]);

  // Filtering trips
  const filteredTrips = useMemo(() => {
    if (!Array.isArray(processedTrips)) {
      return [];
    }

    return processedTrips.filter((trip) => {
      if (!trip) return false;

      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearchTerm =
        (trip.company || '').toLowerCase().includes(searchTermLower) ||
        (trip.branch || '').toLowerCase().includes(searchTermLower) ||
        (trip.driver || '').toLowerCase().includes(searchTermLower) ||
        (trip.notes || '').toLowerCase().includes(searchTermLower);

      const matchesCompany = companyFilter === 'all' || trip.company === companyFilter;
      const matchesVan = vanFilter === 'all' || trip.van === vanFilter;
      const matchesStatus = statusFilter === 'all' || trip.status === statusFilter;

      return matchesSearchTerm && matchesCompany && matchesVan && matchesStatus;
    });
  }, [processedTrips, searchTerm, companyFilter, vanFilter, statusFilter]);

  // Stats calculations
  const todayTrips = processedTrips.filter(trip => {
    const tripDate = new Date(trip.timestamp);
    const today = new Date();
    return tripDate.toDateString() === today.toDateString();
  }).length;

  const thisWeekTrips = processedTrips.filter(trip => {
    const tripDate = new Date(trip.timestamp);
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return tripDate >= weekAgo;
  }).length;

  const activeTrips = processedTrips.filter(trip => trip.status === 'active').length;

  const getVanDisplayName = (vanId) => {
    const van = vans.find(v => v.id === vanId);
    if (van) {
      return (van as any).reference_code || van.license_plate || van.model;
    }
    return vanId;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDriverName = (driverName) => {
    const roleMatch = driverName.match(/^(.+?)\s*\((.+?)\)$/);
    if (roleMatch) {
      return roleMatch[1].trim();
    }
    return driverName;
  };

  const calculateDistance = (trip) => {
    if (trip.startKm && trip.endKm) {
      return trip.endKm - trip.startKm;
    }
    return null;
  };

  // Event handlers
  const handleOpenTripDetails = (trip) => {
    setSelectedTrip(trip);
  };

  const handleDeleteTrip = async (tripId) => {
    try {
      setDeletingTripId(tripId);
      await deleteTrip(tripId);
    } catch (error) {
      console.error('Error deleting trip:', error);
    } finally {
      setDeletingTripId(null);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCompanyFilter('all');
    setVanFilter('all');
    setStatusFilter('all');
  };

  if (isLoading) {
    return <TripHistoryOptimizedSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-4">Impossible de charger l'historique des voyages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Historique des Programmes
            </h1>
            <p className="text-gray-600">
              Consultez et gérez tous les voyages effectués par votre flotte
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtrer
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Filtres de recherche</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Entreprise, succursale, conducteur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Entreprise</label>
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Toutes les entreprises" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les entreprises</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.name}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Véhicule</label>
            <Select value={vanFilter} onValueChange={setVanFilter}>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Tous les véhicules" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les véhicules</SelectItem>
                {vans.map((van) => (
                  <SelectItem key={van.id} value={van.id}>
                    {getVanDisplayName(van.id)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">En cours</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {(searchTerm || companyFilter !== 'all' || vanFilter !== 'all' || statusFilter !== 'all') && (
          <div className="mt-4 flex items-center gap-2">
            <Button variant="outline" onClick={handleClearFilters} className="text-blue-600 border-blue-200">
              Effacer les filtres
            </Button>
            <span className="text-sm text-gray-500">
              {filteredTrips.length} résultat{filteredTrips.length > 1 ? 's' : ''} trouvé{filteredTrips.length > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{todayTrips}</p>
                <p className="text-gray-600 text-sm">Voyages aujourd'hui</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{thisWeekTrips}</p>
                <p className="text-gray-600 text-sm">Voyages cette semaine</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{activeTrips}</p>
                <p className="text-gray-600 text-sm">Voyages en cours</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Truck className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trip History List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              Liste des voyages ({filteredTrips.length})
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Trier par:</span>
              <Select defaultValue="date-desc">
                <SelectTrigger className="w-40 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Plus récent</SelectItem>
                  <SelectItem value="date-asc">Plus ancien</SelectItem>
                  <SelectItem value="company">Entreprise</SelectItem>
                  <SelectItem value="status">Statut</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="p-6">
          {filteredTrips.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun voyage trouvé</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || companyFilter !== 'all' || vanFilter !== 'all' || statusFilter !== 'all'
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Aucun voyage n\'a encore été enregistré'}
              </p>
              {(searchTerm || companyFilter !== 'all' || vanFilter !== 'all' || statusFilter !== 'all') && (
                <Button variant="outline" onClick={handleClearFilters}>
                  Effacer les filtres
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200 cursor-pointer bg-white"
                  onClick={() => handleOpenTripDetails(trip)}
                >
                  {/* Trip Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {trip.company} - {trip.branch}
                        </h4>
                        <Badge 
                          variant={trip.status === 'active' ? 'default' : 'secondary'}
                          className={trip.status === 'active' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                          }
                        >
                          {trip.status === 'active' ? 'En cours' : 'Terminé'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{getDriverName(trip.driver)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Truck className="h-4 w-4" />
                          <span>{trip.van?.slice(0, 8)}...</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{trip.userIds?.length || 0} utilisateurs</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {trip.status === 'active' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700 border-green-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTripToEnd(trip);
                          }}
                        >
                          <CheckCircle className="h-4 w-4" />
                          Terminer
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 border-red-200"
                        disabled={deletingTripId === trip.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setTripToDelete(trip);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        Supprimer
                      </Button>
                    </div>
                  </div>

                  {/* Trip Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500">Date</p>
                        <p className="font-medium">{formatDateOnly(trip.timestamp)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500">Heure</p>
                        <p className="font-medium">{formatTime(trip.timestamp)}</p>
                      </div>
                    </div>
                    {trip.startKm && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="text-gray-500">Km début</p>
                          <p className="font-medium">{trip.startKm.toLocaleString()} km</p>
                        </div>
                      </div>
                    )}
                    {trip.endKm && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-red-500" />
                        <div>
                          <p className="text-gray-500">Km fin</p>
                          <p className="font-medium">{trip.endKm.toLocaleString()} km</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Distance and Notes */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {calculateDistance(trip) && (
                        <div className="text-sm">
                          <span className="text-gray-500">Distance parcourue: </span>
                          <span className="font-semibold text-indigo-600">
                            {calculateDistance(trip).toLocaleString()} km
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {trip.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Notes</p>
                          <p className="text-sm text-gray-700">{trip.notes}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <TripDetailsDialog
        trip={selectedTrip}
        isOpen={!!selectedTrip}
        onClose={() => setSelectedTrip(null)}
      />

      <TripEndDialog
        trip={tripToEnd}
        isOpen={!!tripToEnd}
        onClose={() => setTripToEnd(null)}
      />

      <TripDeleteDialog
        trip={tripToDelete}
        isOpen={!!tripToDelete}
        onClose={() => setTripToDelete(null)}
        onConfirm={() => {
          if (tripToDelete) {
            handleDeleteTrip(tripToDelete.id);
            setTripToDelete(null);
          }
        }}
      />
    </div>
  );
};

export default TripHistoryOptimized;
