
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Truck, Users, FileText, Trash2, MapPin as KmIcon, CheckCircle } from 'lucide-react';
import { type Trip } from '@/contexts/TripContext';
import { useVans } from '@/hooks/useVans';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatDateOnly } from '@/utils/dateUtils';
import { EntityCard } from '@/components/ui/entity-card';
import { Button } from '@/components/ui/button';

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

  const getTripInitials = (trip: Trip) => {
    const driverInfo = getDriverInfo(trip.driver);
    return driverInfo.firstName.slice(0, 2).toUpperCase();
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { variant: 'default' as const, color: 'green' };
      case 'completed':
        return { variant: 'secondary' as const, color: 'gray' };
      default:
        return { variant: 'secondary' as const, color: 'gray' };
    }
  };

  const statusConfig = getStatusConfig(trip.status);

  const metadata = [
    {
      label: 'Date',
      value: formatDateOnly(trip.timestamp),
      icon: <Calendar className="h-4 w-4" />
    },
    {
      label: 'Heure',
      value: formatTime(trip.timestamp),
      icon: <Clock className="h-4 w-4" />
    },
    {
      label: 'Véhicule',
      value: getVanDisplayName(trip.van),
      icon: <Truck className="h-4 w-4" />
    },
    {
      label: 'Équipe',
      value: `${trip.userIds?.length || 0} utilisateurs`,
      icon: <Users className="h-4 w-4" />
    },
    trip.startKm && {
      label: 'Km début',
      value: trip.startKm.toLocaleString() + ' km',
      icon: <KmIcon className="h-4 w-4" />
    },
    trip.endKm && {
      label: 'Km fin',
      value: trip.endKm.toLocaleString() + ' km',
      icon: <KmIcon className="h-4 w-4" />
    },
    calculateDistance(trip) && {
      label: 'Distance',
      value: calculateDistance(trip) + ' km',
      icon: <KmIcon className="h-4 w-4" />
    }
  ].filter(Boolean);

  const actions = (
    <div className="flex items-center gap-2">
      {trip.status === 'active' && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onEndTrip(trip);
          }}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 bg-green-500 text-white hover:bg-green-600"
        >
          <CheckCircle className="h-4 w-4" />
        </Button>
      )}
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onDeleteTrip(trip);
        }}
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 bg-red-500 text-white hover:bg-red-600"
        disabled={deletingTripId === trip.id}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <EntityCard
      title={getTripTitle(trip)}
      subtitle={isMobile && trip.branch ? trip.branch : undefined}
      status={{
        label: trip.status === 'active' ? 'En Mission' : 'Terminé',
        variant: statusConfig.variant,
        color: statusConfig.color
      }}
      metadata={metadata}
      actions={actions}
      onClick={() => onTripClick(trip)}
      className="group hover:shadow-md transition-all duration-200 border-gray-200 hover:border-gray-300"
    >
      <div className="flex items-center space-x-3 mb-4">
        <Avatar className="h-12 w-12 ring-1 ring-gray-200 group-hover:ring-gray-300 transition-all duration-200">
          <AvatarImage 
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${trip.driver}`}
            alt={trip.driver}
          />
          <AvatarFallback className="bg-gray-600 text-white font-medium">
            {getTripInitials(trip)}
          </AvatarFallback>
        </Avatar>
        <div className="text-xs text-gray-500">
          Mission: {trip.status === 'active' ? 'En cours' : 'Terminée'}
        </div>
      </div>

      {trip.notes && (
        <div className="mt-4 p-3 bg-blue-50/50 border border-blue-200/50 rounded-lg">
          <div className="flex items-start space-x-2">
            <FileText className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-blue-600 font-medium mb-1">Notes</p>
              <p className="text-sm text-gray-700 leading-relaxed break-words">
                {trip.notes}
              </p>
            </div>
          </div>
        </div>
      )}
    </EntityCard>
  );
};

export default TripCard;
