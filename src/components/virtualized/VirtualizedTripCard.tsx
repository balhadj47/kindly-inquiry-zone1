
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Truck } from 'lucide-react';
import { format } from 'date-fns';

interface VirtualizedTripCardProps {
  index: number;
  style: React.CSSProperties;
  data: {
    trips: any[];
    getStatusColor: (trip: any) => string;
    getStatusText: (trip: any) => string;
  };
}

const VirtualizedTripCard: React.FC<VirtualizedTripCardProps> = ({ index, style, data }) => {
  const { trips, getStatusColor, getStatusText } = data;
  const trip = trips[index];

  if (!trip) return null;

  return (
    <div style={style} className="px-1 py-2">
      <Card className="hover:shadow-lg transition-shadow">
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
    </div>
  );
};

export default VirtualizedTripCard;
