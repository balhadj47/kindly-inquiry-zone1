
import React from 'react';
import { Trip } from '@/contexts/TripContext';
import { useUsers } from '@/hooks/users';
import { User } from '@/hooks/users/types';
import { useVans } from '@/hooks/useVansOptimized';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Edit, 
  Trash2, 
  Car, 
  MapPin, 
  Phone, 
  Mail, 
  Users, 
  Building2, 
  Calendar,
  Clock
} from 'lucide-react';
import { getDriverName, getCompanyDisplayText, getStatusConfig } from './utils/missionCardUtils';
import { formatDate } from '@/utils/dateUtils';

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
  const { data: vans = [] } = useVans();
  const users: User[] = usersData?.users || [];

  const driverName = getDriverName(mission, users);
  const companyDisplayText = getCompanyDisplayText(mission);
  const statusConfig = getStatusConfig(mission.status || 'active');
  const vanDisplayName = getVanDisplayName(mission.van);

  const getMissionInitials = (companyText: string) => {
    return companyText
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div 
      className="group bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={() => onMissionClick(mission)}
    >
      {/* Header Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <Avatar className="h-14 w-14 ring-2 ring-blue-100 shadow-sm">
              <AvatarImage 
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${companyDisplayText}`}
                alt={companyDisplayText}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-lg">
                {getMissionInitials(companyDisplayText)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 truncate mb-1">
                {companyDisplayText}
              </h3>
              <p className="text-sm text-gray-500">
                {formatDate(mission.timestamp || mission.created_at || new Date().toISOString())}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge 
              variant={statusConfig.variant as any}
              className={`text-xs font-medium ${
                statusConfig.color === 'emerald' 
                  ? 'bg-green-100 text-green-800 border-green-200' 
                  : statusConfig.color === 'blue'
                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                  : statusConfig.color === 'red'
                  ? 'bg-red-100 text-red-800 border-red-200'
                  : 'bg-gray-100 text-gray-600 border-gray-200'
              }`}
            >
              {statusConfig.label}
            </Badge>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {canEdit && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMissionClick(mission);
                  }}
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 bg-blue-50 text-blue-600 hover:bg-blue-100"
                  title="Modifier la mission"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {canDelete && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClick(mission);
                  }}
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 bg-red-50 text-red-600 hover:bg-red-100"
                  title="Supprimer la mission"
                  disabled={actionLoading === 'loading'}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mission Information Section */}
      <div className="px-6 py-4 bg-gray-50">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 text-blue-600 mr-3 flex-shrink-0" />
            <span className="text-gray-700 truncate font-medium">
              {driverName}
            </span>
          </div>
          
          <div className="flex items-center text-sm">
            <Car className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
            <span className="text-gray-700 truncate">
              {vanDisplayName}
            </span>
          </div>
          
          {mission.destination && (
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 text-purple-600 mr-3 flex-shrink-0" />
              <span className="text-gray-700 truncate" title={mission.destination}>
                {mission.destination.length > 40 ? `${mission.destination.substring(0, 40)}...` : mission.destination}
              </span>
            </div>
          )}

          {(mission.startKm || mission.start_km) && (
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 text-orange-600 mr-3 flex-shrink-0" />
              <span className="text-gray-700">
                {mission.startKm || mission.start_km}
                {(mission.endKm || mission.end_km) ? ` → ${mission.endKm || mission.end_km} km` : ' km'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Notes Section */}
      {mission.notes && (
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Building2 className="h-5 w-5 text-gray-600 mr-2" />
              <span className="text-sm font-semibold text-gray-900">
                Notes
              </span>
            </div>
          </div>

          <div className="text-sm bg-blue-50 rounded-lg p-3">
            <span className="text-blue-800">
              {mission.notes.length > 100 ? `${mission.notes.substring(0, 100)}...` : mission.notes}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionCard;
