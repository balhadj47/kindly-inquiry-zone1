import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Truck, Building2, Users, MapPin, FileText, Download, RotateCcw, Trash2 } from 'lucide-react';
import { useTripContext } from '@/contexts/TripContext';
import { useCompanies } from '@/hooks/useCompanies';
import { useVans } from '@/hooks/useVans';
import TripDetailsDialog from './TripDetailsDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const TripHistory = () => {
  const { trips } = useTripContext();
  const { companies } = useCompanies();
  const { vans } = useVans();
  const { toast } = useToast();
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [vanFilter, setVanFilter] = useState('all');
  const [deletingTripId, setDeletingTripId] = useState<number | null>(null);

  const filteredTrips = useMemo(() => {
    return trips.filter(trip => {
      const matchesSearch = 
        trip.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.van.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.driver.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCompany = companyFilter === 'all' || trip.company === companyFilter;
      const matchesVan = vanFilter === 'all' || trip.van === vanFilter;
      
      return matchesSearch && matchesCompany && matchesVan;
    });
  }, [trips, searchTerm, companyFilter, vanFilter]);

  const handleDeleteTrip = async (tripId: number) => {
    setDeletingTripId(tripId);
    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', tripId);

      if (error) {
        console.error('Error deleting trip:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le voyage",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Le voyage a été supprimé avec succès",
      });

      // The trip will be removed from the list automatically when the TripContext refreshes
    } catch (error) {
      console.error('Error deleting trip:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le voyage",
        variant: "destructive",
      });
    } finally {
      setDeletingTripId(null);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCompanyFilter('all');
    setVanFilter('all');
  };

  const todayTrips = trips.filter(trip => {
    const tripDate = new Date(trip.timestamp).toDateString();
    const today = new Date().toDateString();
    return tripDate === today;
  }).length;

  const thisWeekTrips = trips.filter(trip => {
    const tripDate = new Date(trip.timestamp);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return tripDate >= weekAgo;
  }).length;

  const totalVisitedCompanies = new Set(trips.map(trip => trip.company)).size;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Historique des Voyages</h1>
          <p className="text-gray-500 mt-2">Consultez tous les voyages effectués par votre flotte</p>
        </div>
        <Button variant="outline" className="mt-4 md:mt-0">
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtres</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Recherche</label>
              <Input
                placeholder="Rechercher par entreprise, succursale, camionnette..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Entreprise</label>
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
            <div className="space-y-2">
              <label className="text-sm font-medium">Camionnette</label>
              <Select value={vanFilter} onValueChange={setVanFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les camionnettes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les camionnettes</SelectItem>
                  {vans.map((van) => (
                    <SelectItem key={van.id} value={van.license_plate}>
                      {van.license_plate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={clearFilters} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Effacer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{todayTrips}</p>
                <p className="text-sm text-gray-600">Voyages Aujourd'hui</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{thisWeekTrips}</p>
                <p className="text-sm text-gray-600">Cette Semaine</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalVisitedCompanies}</p>
                <p className="text-sm text-gray-600">Entreprises Visitées</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trip History with Delete functionality */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Historique des Voyages ({filteredTrips.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTrips.length === 0 ? (
            <div className="text-center py-12">
              <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun voyage trouvé</h3>
              <p className="text-gray-600">
                {trips.length === 0 
                  ? "Aucun voyage n'a encore été enregistré."
                  : "Aucun voyage ne correspond aux filtres sélectionnés."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div
                    className="flex-1 space-y-2 cursor-pointer"
                    onClick={() => setSelectedTrip(trip)}
                  >
                    <div className="flex items-center space-x-4 text-sm">
                      <Badge variant="outline" className="text-blue-600">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(trip.timestamp)}
                      </Badge>
                      <Badge variant="outline" className="text-green-600">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTime(trip.timestamp)}
                      </Badge>
                      <Badge variant="outline" className="text-purple-600">
                        <Truck className="h-3 w-3 mr-1" />
                        {trip.van}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {trip.driver}
                      </div>
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-1" />
                        {trip.company}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {trip.branch}
                      </div>
                    </div>

                    {trip.notes && (
                      <div className="flex items-center text-sm text-gray-500">
                        <FileText className="h-4 w-4 mr-1" />
                        <span className="truncate">{trip.notes}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800">
                      {trip.userIds?.length || 0} utilisateurs
                    </Badge>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={deletingTripId === trip.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer le voyage</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer le voyage #{trip.id} du {formatDate(trip.timestamp)} ? 
                            Cette action ne peut pas être annulée.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteTrip(trip.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <TripDetailsDialog
        trip={selectedTrip}
        isOpen={!!selectedTrip}
        onClose={() => setSelectedTrip(null)}
      />
    </div>
  );
};

export default TripHistory;
