import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Truck, Building2, Users, MapPin, FileText, Trash2, MapPin as KmIcon, CheckCircle } from 'lucide-react';
import { type Trip } from '@/contexts/TripContext';
import { useVans } from '@/hooks/useVans';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatDateOnly } from '@/utils/dateUtils';

interface TripCardProps {
  trip: Trip;
  onTripClick: (trip: Trip) => void;
  onEndTrip: (trip: Trip) => void;
  onDeleteTrip: (trip: Trip) => void;
  deletingTripId: number | null;
}

const TripCard: React.FC<TripCardProps> = ({
  trip,
  onTripClick,
  onEndTrip,
  onDeleteTrip,
  deletingTripId
}) => {
  const { vans } = useVans();
  const isMobile = useIsMobile();

  const getVanDisplayName = (vanId: string) => {
    const van = vans.find(v => v.id === vanId);
    if (van) {
      return (van as any).reference_code || van.license_plate || van.model;
    }
    return vanId;
  };

  const getVanModel = (vanId: string) => {
    const van = vans.find(v => v.id === vanId);
    return van?.model || '';
  };

  const getVanReference = (vanId: string) => {
    const van = vans.find(v => v.id === vanId);
    return (van as any)?.reference_code || van?.license_plate || '';
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDriverInfo = (driverName: string) => {
    const roleMatch = driverName.match(/^(.+?)\s*\((.+?)\)$/);
    if (roleMatch) {
      const [, name, role] = roleMatch;
      return {
        name: name.trim(),
        role: role.trim(),
        firstName: name.trim().split(' ')[0]
      };
    }
    
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

  const calculateDistance = (trip: Trip) => {
    if (trip.startKm && trip.endKm) {
      return trip.endKm - trip.startKm;
    }
    return null;
  };

  return (
    <div
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
          <span className="text-xs sm:text-sm text-gray-600">{formatDateOnly(trip.timestamp)}</span>
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
          <Button
            size="sm"
            className="h-8 w-8 p-0 bg-green-500 text-white hover:bg-green-600 border-0"
            onClick={(e) => {
              e.stopPropagation();
              onEndTrip(trip);
            }}
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
        )}
        
        <Button
          size="sm"
          className="h-8 w-8 p-0 bg-red-500 text-white hover:bg-red-600 border-0"
          disabled={deletingTripId === trip.id}
          onClick={(e) => {
            e.stopPropagation();
            onDeleteTrip(trip);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TripCard;
