import React, { useState, useMemo } from 'react';
import { Search, Download, Calendar, Clock, Building2, Truck, Users, MapPin, FileText, Trash2, CheckCircle, Filter, TrendingUp, Activity, Car } from 'lucide-react';
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

  // Utility functions
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative px-6 py-12 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Activity className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
                      Historique des Programmes
                    </h1>
                    <p className="text-blue-100 text-lg mt-1">
                      Gérez et consultez tous vos voyages en un seul endroit
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm text-blue-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>{activeTrips} voyages actifs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>{filteredTrips.length} résultats</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres
                </Button>
                <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8">
        {/* Enhanced Filters Section */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-600" />
              Recherche et Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Recherche globale</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Entreprise, véhicule, conducteur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Entreprise</label>
                <Select value={companyFilter} onValueChange={setCompanyFilter}>
                  <SelectTrigger className="border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder="Toutes les entreprises" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">Toutes les entreprises</SelectItem>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.name}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Véhicule</label>
                <Select value={vanFilter} onValueChange={setVanFilter}>
                  <SelectTrigger className="border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder="Tous les véhicules" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">Tous les véhicules</SelectItem>
                    {vans.map((van) => (
                      <SelectItem key={van.id} value={van.id}>
                        {getVanDisplayName(van.id)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Statut</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="active">En cours</SelectItem>
                    <SelectItem value="completed">Terminé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(searchTerm || companyFilter !== 'all' || vanFilter !== 'all' || statusFilter !== 'all') && (
              <div className="mt-6 flex items-center justify-between bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Filter className="h-4 w-4" />
                    <span className="font-medium">Filtres actifs</span>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {filteredTrips.length} résultat{filteredTrips.length > 1 ? 's' : ''}
                  </Badge>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleClearFilters} 
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  Effacer tout
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold mb-1">{todayTrips}</p>
                  <p className="text-blue-100">Voyages aujourd'hui</p>
                </div>
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Calendar className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold mb-1">{thisWeekTrips}</p>
                  <p className="text-emerald-100">Cette semaine</p>
                </div>
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <TrendingUp className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold mb-1">{activeTrips}</p>
                  <p className="text-orange-100">Voyages actifs</p>
                </div>
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Car className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Trip History List */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
                <FileText className="h-6 w-6 text-blue-600" />
                Liste des voyages ({filteredTrips.length})
              </CardTitle>
              <Select defaultValue="date-desc">
                <SelectTrigger className="w-48 border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="date-desc">Plus récent</SelectItem>
                  <SelectItem value="date-asc">Plus ancien</SelectItem>
                  <SelectItem value="company">Entreprise</SelectItem>
                  <SelectItem value="status">Statut</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {filteredTrips.length === 0 ? (
              <div className="text-center py-16">
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                  <FileText className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Aucun voyage trouvé</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {searchTerm || companyFilter !== 'all' || vanFilter !== 'all' || statusFilter !== 'all'
                    ? 'Aucun voyage ne correspond à vos critères de recherche. Essayez de modifier vos filtres.'
                    : 'Aucun voyage n\'a encore été enregistré dans le système.'}
                </p>
                {(searchTerm || companyFilter !== 'all' || vanFilter !== 'all' || statusFilter !== 'all') && (
                  <Button variant="outline" onClick={handleClearFilters} className="border-blue-200 text-blue-600 hover:bg-blue-50">
                    Effacer les filtres
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="group relative bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer overflow-hidden"
                    onClick={() => handleOpenTripDetails(trip)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Trip Header */}
                    <div className="relative flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                            <Building2 className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {trip.company}
                            </h4>
                            <p className="text-gray-600 font-medium">{trip.branch}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Users className="h-4 w-4" />
                            <span className="font-medium">{getDriverName(trip.driver)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Truck className="h-4 w-4" />
                            <span className="font-medium">{trip.van?.slice(0, 8)}...</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Users className="h-4 w-4" />
                            <span className="font-medium">{trip.userIds?.length || 0} utilisateurs</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant={trip.status === 'active' ? 'default' : 'secondary'}
                          className={`px-4 py-2 text-sm font-semibold ${
                            trip.status === 'active' 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0' 
                              : 'bg-gray-100 text-gray-600 border-gray-200'
                          }`}
                        >
                          {trip.status === 'active' ? '🔴 En cours' : '✅ Terminé'}
                        </Badge>
                      </div>
                    </div>

                    {/* Trip Details Grid */}
                    <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Calendar className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Date</p>
                          <p className="font-semibold text-gray-900">{formatDateOnly(trip.timestamp)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Clock className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Heure</p>
                          <p className="font-semibold text-gray-900">{formatTime(trip.timestamp)}</p>
                        </div>
                      </div>
                      {trip.startKm && (
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <MapPin className="h-4 w-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Km début</p>
                            <p className="font-semibold text-gray-900">{trip.startKm.toLocaleString()} km</p>
                          </div>
                        </div>
                      )}
                      {trip.endKm && (
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-100 rounded-lg">
                            <MapPin className="h-4 w-4 text-red-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Km fin</p>
                            <p className="font-semibold text-gray-900">{trip.endKm.toLocaleString()} km</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Distance and Notes */}
                    {calculateDistance(trip) && (
                      <div className="relative mb-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-500 rounded-lg">
                            <TrendingUp className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Distance parcourue</p>
                            <p className="text-2xl font-bold text-indigo-600">
                              {calculateDistance(trip).toLocaleString()} km
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {trip.notes && (
                      <div className="relative mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-gray-200 rounded-lg">
                            <FileText className="h-4 w-4 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Notes</p>
                            <p className="text-gray-700 leading-relaxed">{trip.notes}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="relative flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                      {trip.status === 'active' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200 font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTripToEnd(trip);
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Terminer
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
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
                ))}
              </div>
            )}
          </CardContent>
        </Card>
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
