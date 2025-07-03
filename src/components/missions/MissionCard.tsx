
import React from 'react';
import { Circle, Clock, MapPin, Users, Car } from 'lucide-react';
import { Trip } from '@/contexts/TripContext';
import { useUsers } from '@/hooks/users';
import { EntityCard } from '@/components/ui/entity-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import MissionCardActions from './MissionCardActions';

interface MissionCardProps {
  mission: Trip;
  onMissionClick: (mission: Trip) => void;
  onTerminateClick: (mission: Trip) => void;
  onDeleteClick: (mission: Trip) => void;
  getVanDisplayName: (vanId: string) => string;
  canEdit: boolean;
  canDelete: boolean;
  actionLoading: string | null;
  isTerminating: boolean;
}

const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  onMissionClick,
  onTerminateClick,
  onDeleteClick,
  getVanDisplayName,
  canEdit,
  canDelete,
  actionLoading,
  isTerminating,
}) => {
  const { data: usersData } = useUsers();
  const users = usersData?.users || [];

  const getUserName = (userId: string) => {
    const user = users.find(u => {
      const userIdStr = u.id.toString();
      return userIdStr === userId;
    });
    return user ? user.name : `User ${userId}`;
  };

  const getDriverName = () => {
    if (!mission?.userRoles || mission.userRoles.length === 0) {
      return mission?.driver || 'Aucun chauffeur assigné';
    }

    const driverUserRole = mission.userRoles.find(userRole => 
      userRole.roles.some(role => {
        if (typeof role === 'string') {
          return role === 'Chauffeur';
        } else if (typeof role === 'object' && role !== null) {
          const roleObj = role as any;
          return roleObj.name === 'Chauffeur';
        }
        return false;
      })
    );

    if (driverUserRole) {
      return getUserName(driverUserRole.userId);
    }

    return mission?.driver || 'Aucun chauffeur assigné';
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { 
          label: 'Active', 
          variant: 'default' as const, 
          color: 'emerald' 
        };
      case 'completed':
        return { 
          label: 'Terminée', 
          variant: 'outline' as const, 
          color: 'blue' 
        };
      case 'terminated':
        return { 
          label: 'Annulée', 
          variant: 'destructive' as const, 
          color: 'red' 
        };
      default:
        return { 
          label: 'Inconnu', 
          variant: 'secondary' as const, 
          color: 'gray' 
        };
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const statusConfig = getStatusConfig(mission.status || 'active');
  const driverName = getDriverName();

  const metadata = [
    {
      label: 'Chauffeur',
      value: driverName,
      icon: <Users className="h-4 w-4" />
    },
    {
      label: 'Véhicule',
      value: getVanDisplayName(mission.van),
      icon: <Car className="h-4 w-4" />
    },
    (mission.startKm || mission.start_km) && {
      label: 'Kilométrage',
      value: `${mission.startKm || mission.start_km}${
        (mission.endKm || mission.end_km) ? ` → ${mission.endKm || mission.end_km}` : ''
      }`,
      icon: <Clock className="h-4 w-4" />
    },
    mission.destination && {
      label: 'Destination',
      value: mission.destination,
      icon: <MapPin className="h-4 w-4" />
    }
  ].filter(Boolean);

  const actions = (canEdit || canDelete) && (
    <MissionCardActions
      mission={mission}
      onEdit={() => onMissionClick(mission)}
      onDelete={() => onDeleteClick(mission)}
      onView={() => onMissionClick(mission)}
      onTerminate={() => onTerminateClick(mission)}
    />
  );

  return (
    <EntityCard
      title={mission.company}
      subtitle={mission.branch}
      status={{
        label: statusConfig.label,
        variant: statusConfig.variant,
        color: statusConfig.color
      }}
      metadata={metadata}
      actions={actions}
      onClick={() => onMissionClick(mission)}
      className="group hover:shadow-md transition-all duration-200 border-gray-200 hover:border-gray-300"
    >
      <div className="flex items-center space-x-3 mb-4">
        <Avatar className="h-12 w-12 ring-1 ring-gray-200 group-hover:ring-gray-300 transition-all duration-200">
          <AvatarImage 
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${driverName}`}
            alt={driverName}
          />
          <AvatarFallback className="bg-gray-600 text-white font-medium">
            {getUserInitials(driverName)}
          </AvatarFallback>
        </Avatar>
        <div className="text-xs text-gray-500">
          Mission: {mission.status === 'active' ? 'En cours' : 'Terminée'}
        </div>
      </div>

      {mission.notes && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <span className="font-medium">Notes:</span> {mission.notes}
          </p>
        </div>
      )}
    </EntityCard>
  );
};

export default MissionCard;
