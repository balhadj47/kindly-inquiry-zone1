
import React from 'react';
import { Circle, Clock, MapPin, Users, Car } from 'lucide-react';
import { Trip } from '@/contexts/TripContext';
import { useUsers } from '@/hooks/users';
import { EntityCard } from '@/components/ui/entity-card';
import { ActionButton } from '@/components/ui/action-button';

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

  const statusConfig = getStatusConfig(mission.status || 'active');

  const metadata = [
    {
      label: 'Chauffeur',
      value: getDriverName(),
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
    <div className="flex items-center gap-2">
      {canDelete && mission.status === 'active' && (
        <ActionButton
          onClick={(e) => {
            e.stopPropagation();
            onTerminateClick(mission);
          }}
          icon={Circle}
          variant="outline"
          size="sm"
          disabled={actionLoading === 'loading' || isTerminating}
          loading={isTerminating}
          className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
        >
          Terminer
        </ActionButton>
      )}
      
      {canDelete && (
        <ActionButton
          onClick={(e) => {
            e.stopPropagation();
            onDeleteClick(mission);
          }}
          icon={Circle}
          variant="outline"
          size="sm"
          disabled={actionLoading === 'loading'}
          className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
        >
          Supprimer
        </ActionButton>
      )}
    </div>
  );

  return (
    <EntityCard
      title={mission.company}
      subtitle={mission.branch}
      status={statusConfig}
      metadata={metadata}
      actions={actions}
      onClick={() => onMissionClick(mission)}
      className="transition-all duration-200 hover:shadow-lg"
    >
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
