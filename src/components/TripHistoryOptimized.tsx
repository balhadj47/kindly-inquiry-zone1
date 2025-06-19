
import React, { useState, useMemo } from 'react';
import { Plus, Search, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTrip } from '@/contexts/TripContext';
import TripHistoryOptimizedSkeleton from './trip-history/TripHistoryOptimizedSkeleton';
import TripDetailsDialog from './TripDetailsDialog';
import TripEndDialog from './trip-history/TripEndDialog';
import TripDeleteDialog from './trip-history/TripDeleteDialog';
import { useVans } from '@/hooks/useVans';
import { useCompanies } from '@/hooks/useCompanies';
import { Calendar, Clock, Building2, Truck, Users, MapPin, FileText, Trash2, CheckCircle } from 'lucide-react';
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

        // Handle complex date structures more robustly
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

      return matchesSearchTerm && matchesCompany && matchesVan;
    });
  }, [processedTrips, searchTerm, companyFilter, vanFilter]);

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

  const visitedCompanies = new Set(processedTrips.map(trip => trip.company)).size;

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
          <Button onClick={() => window.location.reload()}>
            Actualiser la page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Historique des Programmes</h1>
          <p className="text-gray-600">Consultez tous les voyages effectués par votre flotte</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Filtres</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par entreprise, succursale, camionnette..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Entreprises</label>
              <Select value={companyFilter} onValueChange={setCompanyFilter}>
                <SelectTrigger>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Camionnette</label>
              <Select value={vanFilter} onValueChange={setVanFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les camionnettes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les camionnettes</SelectItem>
                  {vans.map((van) => (
                    <SelectItem key={van.id} value={van.id}>
                      {getVanDisplayName(van.id)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {(searchTerm || companyFilter !== 'all' || vanFilter !== 'all') && (
            <div className="mt-4">
              <Button variant="outline" onClick={handleClearFilters} className="text-blue-600">
                <span className="mr-2">↻</span>
                Effacer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{todayTrips}</p>
                <p className="text-gray-600">Voyages Aujourd'hui</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{thisWeekTrips}</p>
                <p className="text-gray-600">Cette Semaine</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{visitedCompanies}</p>
                <p className="text-gray-600">Entreprises Visitées</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trip History */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Historique des Voyages ({filteredTrips.length})</h3>
          
          {filteredTrips.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun voyage trouvé</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleOpenTripDetails(trip)}
                >
                  {/* Trip Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {trip.company} - {trip.branch} - {getDriverName(trip.driver)}
                      </h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                          <span>{trip.van.slice(0, 8)}...</span>
                        </div>
                        <Badge 
                          variant={trip.status === 'active' ? 'default' : 'secondary'}
                          className={trip.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
                        >
                          {trip.status === 'active' ? 'En Mission' : 'Terminé'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {trip.userIds?.length || 0} utilisateurs
                      </span>
                      <div className="flex gap-2">
                        {trip.status === 'active' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:text-green-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              setTripToEnd(trip);
                            }}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          disabled={deletingTripId === trip.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setTripToDelete(trip);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Trip Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{formatDateOnly(trip.timestamp)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{formatTime(trip.timestamp)}</span>
                    </div>
                    {trip.startKm && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-orange-500" />
                        <span>Début: {trip.startKm.toLocaleString()} km</span>
                      </div>
                    )}
                    {trip.endKm && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-red-500" />
                        <span>Fin: {trip.endKm.toLocaleString()} km</span>
                      </div>
                    )}
                  </div>

                  {calculateDistance(trip) && (
                    <div className="mt-2 text-sm">
                      <span className="text-indigo-600 font-medium">
                        Distance: {calculateDistance(trip).toLocaleString()} km
                      </span>
                    </div>
                  )}

                  {trip.notes && (
                    <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{trip.notes}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
