
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Truck, Building2, Users, MapPin, FileText, Trash2 } from 'lucide-react';
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
import TripHistoryEmptyState from './TripHistoryEmptyState';

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
                          Êtes-vous sûr de vouloir supprimer le voyage #{trip.id} du {formatDate(trip.timestamp)} ? 
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
  );
};

export default TripHistoryList;
