
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Truck, 
  Calendar, 
  Users, 
  MapPin, 
  FileText, 
  Trash2, 
  Square,
  Eye
} from 'lucide-react';
import { formatDateOnly } from '@/utils/dateUtils';
import { Trip } from '@/contexts/TripContext';

interface MissionCardProps {
  trip: Trip;
  getVanDisplayName: (vanId: string) => string;
  onViewDetails: (trip: Trip) => void;
  onDelete: (trip: Trip) => void;
  onTerminate: (trip: Trip) => void;
}

const MissionCard: React.FC<MissionCardProps> = ({ 
  trip, 
  getVanDisplayName, 
  onViewDetails,
  onDelete,
  onTerminate
}) => {
  const isActive = trip.status === 'active';

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500 cursor-pointer"
          onClick={() => onViewDetails(trip)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-1">
              {trip.company}
            </h3>
            <p className="text-blue-600 font-medium">{trip.branch}</p>
            <p className="text-sm text-gray-600 mt-1">{trip.driver}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={isActive ? 'default' : 'secondary'}
              className={isActive 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-gray-500 text-white'
              }
            >
              {isActive ? 'En Mission' : 'Terminé'}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Truck className="h-4 w-4 text-blue-500" />
            <span className="font-medium">{getVanDisplayName(trip.van)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-green-500" />
            <span>{formatDateOnly(trip.timestamp)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4 text-purple-500" />
            <span>{trip.userIds?.length || 0} utilisateurs</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-red-500" />
            <span>{trip.startKm || 0} km</span>
          </div>
        </div>

        {trip.notes && (
          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg mb-4">
            <FileText className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700 line-clamp-2">{trip.notes}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(trip);
            }}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Détails
          </Button>
          
          <div className="flex items-center gap-2">
            {isActive && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onTerminate(trip);
                }}
                className="flex items-center gap-2 text-orange-600 border-orange-200 hover:bg-orange-50"
              >
                <Square className="h-4 w-4" />
                Terminer
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(trip);
              }}
              className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MissionCard;
