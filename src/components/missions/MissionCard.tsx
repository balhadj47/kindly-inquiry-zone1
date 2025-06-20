
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock,
  MapPin, 
  FileText, 
  Trash2, 
  Square,
  Users,
  Link
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
    <Card className="hover:shadow-md transition-all duration-200 border border-gray-200 cursor-pointer"
          onClick={() => onViewDetails(trip)}>
      <CardContent className="p-6">
        {/* Header with company info and status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {trip.company} - {getVanDisplayName(trip.van)} - {trip.branch}
            </h3>
            
            {/* Trip ID with link icon */}
            <div className="flex items-center gap-2 mb-2">
              <Link className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-purple-600 font-mono">
                {trip.id.toString().padStart(8, '0')}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge 
              variant={isActive ? 'default' : 'secondary'}
              className={isActive 
                ? 'bg-green-500 hover:bg-green-600 text-white px-3 py-1' 
                : 'bg-gray-500 text-white px-3 py-1'
              }
            >
              {isActive ? 'En Mission' : 'Terminé'}
            </Badge>
          </div>
        </div>

        {/* Mission details in a row */}
        <div className="flex items-center gap-6 mb-4 text-sm">
          <div className="flex items-center gap-2 text-blue-600">
            <Calendar className="h-4 w-4" />
            <span>{formatDateOnly(trip.timestamp)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-green-600">
            <Clock className="h-4 w-4" />
            <span>{new Date(trip.timestamp).toLocaleTimeString('fr-FR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}</span>
          </div>
          
          <div className="flex items-center gap-2 text-green-600">
            <Users className="h-4 w-4" />
            <span>{trip.userIds?.length || 0} utilisateurs</span>
          </div>
        </div>

        {/* Kilometers info */}
        <div className="flex items-center gap-6 mb-4 text-sm">
          <div className="flex items-center gap-2 text-orange-600">
            <MapPin className="h-4 w-4" />
            <span>Début: {trip.startKm?.toLocaleString() || 0} km</span>
          </div>
          
          {trip.endKm && (
            <>
              <div className="flex items-center gap-2 text-orange-600">
                <MapPin className="h-4 w-4" />
                <span>Fin: {trip.endKm.toLocaleString()} km</span>
              </div>
              
              <div className="flex items-center gap-2 text-purple-600">
                <span>Distance: {(trip.endKm - (trip.startKm || 0)).toLocaleString()} km</span>
              </div>
            </>
          )}
        </div>

        {/* Notes */}
        {trip.notes && (
          <div className="flex items-start gap-2 mb-4">
            <FileText className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700">{trip.notes}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
          {isActive && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onTerminate(trip);
              }}
              className="flex items-center gap-2 text-gray-600 border-gray-300 hover:bg-gray-50"
            >
              <Square className="h-4 w-4" />
              Terminé
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
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MissionCard;
