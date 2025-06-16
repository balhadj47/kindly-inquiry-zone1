
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, Truck, Building2, Users, MapPin, FileText, Trash2, MapPin as KmIcon, CheckCircle } from 'lucide-react';
import { Trip } from '@/contexts/TripContext';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import TripHistoryEmptyState from './TripHistoryEmptyState';
import { useTripContext } from '@/contexts/TripContext';
import { useToast } from '@/hooks/use-toast';

interface TripHistoryListProps {
  filteredTrips: Trip[];
  totalTrips: Trip[];
  onTripClick: (trip: Trip) => void;
  onDeleteTrip: (tripId: number) => Promise<void>;
  deletingTripId: number | null;
}

const TripHistoryList: React.FC<TripHistoryListProps> = ({
  filteredTrips,
  totalTrips,
  onTripClick,
  onDeleteTrip,
  deletingTripId
}) => {
  const { endTrip } = useTripContext();
  const { toast } = useToast();
  const [endKmDialogOpen, setEndKmDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [endKmValue, setEndKmValue] = useState('');

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

  const getDriverInfo = (driverName: string) => {
    // Check if driver name includes role in parentheses
    const roleMatch = driverName.match(/^(.+?)\s*\((.+?)\)$/);
    if (roleMatch) {
      const [, name, role] = roleMatch;
      return {
        name: name.trim(),
        role: role.trim(),
        firstName: name.trim().split(' ')[0]
      };
    }
    
    // Fallback for old format without role
    return {
      name: driverName,
      role: null,
      firstName: driverName.split(' ')[0]
    };
  };

  const getTripTitle = (trip: Trip) => {
    const driverInfo = getDriverInfo(trip.driver);
    return `${trip.company} - ${trip.branch} - ${driverInfo.firstName}`;
  };

  const handleEndTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setEndKmValue('');
    setEndKmDialogOpen(true);
  };

  const handleEndTripConfirm = async () => {
    if (!selectedTrip || !endKmValue) return;

    const endKmNumber = parseInt(endKmValue);
    
    if (isNaN(endKmNumber) || endKmNumber < 0) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une valeur de kilomètres valide",
        variant: "destructive",
      });
      return;
    }

    if (selectedTrip.startKm && endKmNumber < selectedTrip.startKm) {
      toast({
        title: "Erreur",
        description: "Les kilomètres de fin ne peuvent pas être inférieurs aux kilomètres de début",
        variant: "destructive",
      });
      return;
    }

    try {
      await endTrip(selectedTrip.id, endKmNumber);
      toast({
        title: "Succès",
        description: "Le voyage a été terminé avec succès",
      });
      setEndKmDialogOpen(false);
      setSelectedTrip(null);
      setEndKmValue('');
    } catch (error) {
      console.error('Error ending trip:', error);
      toast({
        title: "Erreur",
        description: "Impossible de terminer le voyage",
        variant: "destructive",
      });
    }
  };

  const calculateDistance = (trip: Trip) => {
    if (trip.startKm && trip.endKm) {
      return trip.endKm - trip.startKm;
    }
    return null;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Historique des Voyages ({filteredTrips.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTrips.length === 0 ? (
            <TripHistoryEmptyState 
              filteredTripsCount={filteredTrips.length}
              totalTripsCount={totalTrips.length}
            />
          ) : (
            <div className="space-y-4">
              {filteredTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div
                    className="flex-1 space-y-2 cursor-pointer"
                    onClick={() => onTripClick(trip)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {getTripTitle(trip)}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-purple-600">
                          <Truck className="h-3 w-3 mr-1" />
                          {trip.van}
                        </Badge>
                        <Badge 
                          variant={trip.status === 'active' ? 'default' : 'secondary'}
                          className={trip.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}
                        >
                          {trip.status === 'active' ? 'En Mission' : 'Terminé'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <Badge variant="outline" className="text-blue-600">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(trip.timestamp)}
                      </Badge>
                      <Badge variant="outline" className="text-green-600">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTime(trip.timestamp)}
                      </Badge>
                    </div>

                    {/* Kilometer information */}
                    {(trip.startKm || trip.endKm) && (
                      <div className="flex items-center space-x-4 text-sm">
                        {trip.startKm && (
                          <Badge variant="outline" className="text-orange-600">
                            <KmIcon className="h-3 w-3 mr-1" />
                            Début: {trip.startKm.toLocaleString()} km
                          </Badge>
                        )}
                        {trip.endKm && (
                          <Badge variant="outline" className="text-red-600">
                            <KmIcon className="h-3 w-3 mr-1" />
                            Fin: {trip.endKm.toLocaleString()} km
                          </Badge>
                        )}
                        {calculateDistance(trip) && (
                          <Badge variant="outline" className="text-indigo-600">
                            <MapPin className="h-3 w-3 mr-1" />
                            Distance: {calculateDistance(trip)} km
                          </Badge>
                        )}
                      </div>
                    )}

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
                    
                    {trip.status === 'active' && (
                      <Dialog open={endKmDialogOpen} onOpenChange={setEndKmDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEndTrip(trip);
                            }}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Terminer le voyage</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p>Voyage: {getTripTitle(trip)}</p>
                            {trip.startKm && (
                              <p className="text-sm text-muted-foreground">
                                Kilomètres de début: {trip.startKm.toLocaleString()} km
                              </p>
                            )}
                            <div>
                              <Label htmlFor="endKm">Kilomètres de fin</Label>
                              <Input
                                id="endKm"
                                type="number"
                                placeholder="Entrez les kilomètres de fin"
                                value={endKmValue}
                                onChange={(e) => setEndKmValue(e.target.value)}
                                min={trip.startKm || 0}
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                onClick={() => setEndKmDialogOpen(false)}
                              >
                                Annuler
                              </Button>
                              <Button
                                onClick={handleEndTripConfirm}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Terminer le voyage
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={deletingTripId === trip.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Delete trigger clicked for trip:', trip.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer le voyage</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer le voyage "{getTripTitle(trip)}" du {formatDate(trip.timestamp)} ? 
                            Cette action ne peut pas être annulée.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteTrip(trip.id);
                            }}
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
    </>
  );
};

export default TripHistoryList;
