import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, Truck, Building2, Users, MapPin, FileText, Trash2, MapPin as KmIcon, CheckCircle } from 'lucide-react';
import { type Trip } from '@/contexts/TripContext';
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
import { useTrip } from '@/contexts/TripContext';
import { useToast } from '@/hooks/use-toast';
import { useVans } from '@/hooks/useVans';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const { endTrip } = useTrip();
  const { vans } = useVans();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [endKmDialogOpen, setEndKmDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [endKmValue, setEndKmValue] = useState('');

  const getVanDisplayName = (vanId: string) => {
    const van = vans.find(v => v.id === vanId);
    if (van) {
      return van.reference_code || van.license_plate || van.model;
    }
    return vanId;
  };

  const getVanModel = (vanId: string) => {
    const van = vans.find(v => v.id === vanId);
    return van?.model || '';
  };

  const getVanReference = (vanId: string) => {
    const van = vans.find(v => v.id === vanId);
    return van?.reference_code || van?.license_plate || '';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: isMobile ? '2-digit' : 'numeric'
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
    return isMobile 
      ? `${trip.company} - ${driverInfo.firstName}`
      : `${trip.company} - ${trip.branch} - ${driverInfo.firstName}`;
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
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-900`}>
            Historique des Voyages ({filteredTrips.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredTrips.length === 0 ? (
            <TripHistoryEmptyState 
              filteredTripsCount={filteredTrips.length}
              totalTripsCount={totalTrips.length}
            />
          ) : (
            filteredTrips.map((trip) => (
              <div
                key={trip.id}
                className="group bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer"
                onClick={() => onTripClick(trip)}
              >
                {/* Header with title and status */}
                <div className={`flex items-start justify-between mb-3 ${isMobile ? 'flex-col space-y-2' : ''}`}>
                  <div className="flex-1 min-w-0">
                    <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-900 mb-1 truncate`}>
                      {getTripTitle(trip)}
                    </h3>
                    {isMobile && trip.branch && (
                      <p className="text-sm text-gray-500">{trip.branch}</p>
                    )}
                  </div>
                  <div className={`flex items-center gap-3 ${isMobile ? 'w-full justify-start' : 'ml-4'}`}>
                    <Badge 
                      variant={trip.status === 'active' ? 'default' : 'secondary'}
                      className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium ${
                        trip.status === 'active' 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}
                    >
                      {trip.status === 'active' ? 'En Mission' : 'Terminé'}
                    </Badge>
                  </div>
                </div>

                {/* Van and User Info */}
                <div className={`flex items-center gap-4 sm:gap-6 mb-3 ${isMobile ? 'flex-col items-start space-y-2' : ''}`}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
                      <Truck className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-purple-600">{getVanDisplayName(trip.van)}</p>
                      <p className="text-xs text-gray-500">{getVanModel(trip.van)}</p>
                      {getVanReference(trip.van) && (
                        <p className="text-xs text-gray-400">Réf: {getVanReference(trip.van)}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-blue-600">
                      {trip.userIds?.length || 0} utilisateurs
                    </span>
                  </div>
                </div>

                {/* Date, Time and Distance Info */}
                <div className={`flex items-center gap-4 sm:gap-6 mb-3 ${isMobile ? 'flex-col items-start space-y-2' : ''}`}>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                    <span className="text-xs sm:text-sm text-gray-600">{formatDate(trip.timestamp)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                    <span className="text-xs sm:text-sm text-gray-600">{formatTime(trip.timestamp)}</span>
                  </div>
                </div>

                {/* Kilometer information */}
                {(trip.startKm || trip.endKm) && (
                  <div className={`flex items-center gap-4 sm:gap-6 mb-3 ${isMobile ? 'flex-col items-start space-y-2' : 'flex-wrap'}`}>
                    {trip.startKm && (
                      <div className="flex items-center gap-2">
                        <div className="p-1 sm:p-1.5 bg-orange-100 rounded-md">
                          <KmIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-orange-600" />
                        </div>
                        <span className="text-xs sm:text-sm text-gray-600">
                          Début: <span className="font-medium">{trip.startKm.toLocaleString()} km</span>
                        </span>
                      </div>
                    )}
                    {trip.endKm && (
                      <div className="flex items-center gap-2">
                        <div className="p-1 sm:p-1.5 bg-red-100 rounded-md">
                          <KmIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-red-600" />
                        </div>
                        <span className="text-xs sm:text-sm text-gray-600">
                          Fin: <span className="font-medium">{trip.endKm.toLocaleString()} km</span>
                        </span>
                      </div>
                    )}
                    {calculateDistance(trip) && (
                      <div className="flex items-center gap-2">
                        <div className="p-1 sm:p-1.5 bg-indigo-100 rounded-md">
                          <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-indigo-600" />
                        </div>
                        <span className="text-xs sm:text-sm text-gray-600">
                          Distance: <span className="font-medium">{calculateDistance(trip)} km</span>
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Notes */}
                {trip.notes && (
                  <div className="flex items-start gap-2 mb-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-gray-700 break-words">{trip.notes}</p>
                  </div>
                )}

                {/* Action buttons */}
                <div className={`flex items-center gap-2 pt-2 border-t border-gray-100 ${isMobile ? 'justify-center' : 'justify-end'}`}>
                  {trip.status === 'active' && (
                    <Dialog open={endKmDialogOpen} onOpenChange={setEndKmDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200 text-xs sm:text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEndTrip(trip);
                          }}
                        >
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          {isMobile ? 'Terminer' : 'Terminer'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className={isMobile ? 'w-[95vw] max-w-md' : ''}>
                        <DialogHeader>
                          <DialogTitle className={isMobile ? 'text-base' : ''}>Terminer le voyage</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className={`${isMobile ? 'text-sm' : ''}`}>Voyage: {getTripTitle(trip)}</p>
                          {trip.startKm && (
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              Kilomètres de début: {trip.startKm.toLocaleString()} km
                            </p>
                          )}
                          <div>
                            <Label htmlFor="endKm" className={isMobile ? 'text-sm' : ''}>Kilomètres de fin</Label>
                            <Input
                              id="endKm"
                              type="number"
                              placeholder="Entrez les kilomètres de fin"
                              value={endKmValue}
                              onChange={(e) => setEndKmValue(e.target.value)}
                              min={trip.startKm || 0}
                              className={isMobile ? 'text-sm' : ''}
                            />
                          </div>
                          <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'justify-end space-x-2'}`}>
                            <Button
                              variant="outline"
                              onClick={() => setEndKmDialogOpen(false)}
                              className={isMobile ? 'w-full text-sm' : ''}
                            >
                              Annuler
                            </Button>
                            <Button
                              onClick={handleEndTripConfirm}
                              className={`bg-green-600 hover:bg-green-700 ${isMobile ? 'w-full text-sm' : ''}`}
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
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        disabled={deletingTripId === trip.id}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className={isMobile ? 'w-[95vw] max-w-md' : ''}>
                      <AlertDialogHeader>
                        <AlertDialogTitle className={isMobile ? 'text-base' : ''}>Supprimer le voyage</AlertDialogTitle>
                        <AlertDialogDescription className={isMobile ? 'text-sm' : ''}>
                          Êtes-vous sûr de vouloir supprimer le voyage "{getTripTitle(trip)}" du {formatDate(trip.timestamp)} ? 
                          Cette action ne peut pas être annulée.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className={isMobile ? 'flex-col gap-2' : ''}>
                        <AlertDialogCancel className={isMobile ? 'w-full text-sm' : ''}>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteTrip(trip.id);
                          }}
                          className={`bg-red-600 hover:bg-red-700 ${isMobile ? 'w-full text-sm' : ''}`}
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default TripHistoryList;
