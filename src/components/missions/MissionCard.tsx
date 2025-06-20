
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, Calendar, Users, MapPin, FileText } from 'lucide-react';
import { formatDateOnly } from '@/utils/dateUtils';
import { Trip } from '@/contexts/TripContext';

interface MissionCardProps {
  trip: Trip;
  getVanDisplayName: (vanId: string) => string;
}

const MissionCard: React.FC<MissionCardProps> = ({ trip, getVanDisplayName }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-1">
              {trip.company} - {trip.branch}
            </h3>
            <p className="text-sm text-gray-600">{trip.driver}</p>
          </div>
          <Badge 
            variant={trip.status === 'active' ? 'default' : 'secondary'}
            className={trip.status === 'active' 
              ? 'bg-green-100 text-green-800 border-green-200' 
              : 'bg-gray-100 text-gray-600 border-gray-200'
            }
          >
            {trip.status === 'active' ? 'En Mission' : 'Terminé'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-gray-500" />
            <span>{getVanDisplayName(trip.van)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>{formatDateOnly(trip.timestamp)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span>{trip.userIds?.length || 0} utilisateurs</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>{trip.startKm} km</span>
          </div>
        </div>

        {trip.notes && (
          <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
            <FileText className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700">{trip.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MissionCard;
