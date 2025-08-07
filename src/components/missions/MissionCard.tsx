import React from 'react';
import { Trip } from '@/contexts/TripContext';
import { useUsers } from '@/hooks/users';
import { User } from '@/hooks/users/types';
import { useVans } from '@/hooks/useVansOptimized';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Trash2, 
  Car, 
  MapPin, 
  Phone, 
  Mail, 
  Users, 
  Building2, 
  Calendar,
  Clock,
  StopCircle
} from 'lucide-react';
import { getChefDeGroupeName, getStatusConfig } from './utils/missionCardUtils';
import { formatDate } from '@/utils/dateUtils';

interface MissionCardProps {
  mission: Trip;
  onMissionClick: (mission: Trip) => void;
  onDeleteClick: (mission: Trip) => void;
  onTerminateClick?: (mission: Trip) => void;
  getVanDisplayName: (vanId: string) => string;
  actionLoading: string | null;
}

const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  onMissionClick,
  onDeleteClick,
  onTerminateClick,
  getVanDisplayName,
  actionLoading,
}) => {
  const { data: usersData } = useUsers();
  const { data: vans = [] } = useVans();
  const users: User[] = usersData?.users || [];

  console.log('🎯 MissionCard: Rendering mission:', mission.id, 'with users count:', users.length);

  const chefDeGroupeName = getChefDeGroupeName(mission, users);
  const statusConfig = getStatusConfig(mission.status || 'active');
  
  // Get van reference code (not license plate)
  const van = vans.find(v => v.id === mission.van || v.reference_code === mission.van);
  const vanReference = van?.reference_code || mission.van;
  
  // Create mission title with Chef de Groupe name and van reference
  const missionTitle = `${chefDeGroupeName} - ${vanReference}`;

  const getMissionInitials = (title: string) => {
    return title
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const canTerminate = mission.status === 'active';
  const canDelete = mission.status !== 'completed';

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
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${missionTitle}`}
                alt={missionTitle}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-lg">
                {getMissionInitials(missionTitle)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="mb-1">
                      <h3 className="text-xl font-bold text-gray-900 leading-tight line-clamp-1 hover:text-primary transition-colors">
                        {chefDeGroupeName}
                      </h3>
                      <p className="text-lg font-semibold text-blue-600 leading-tight line-clamp-1">
                        {vanReference}
                      </p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="max-w-xs">
                      <p className="font-bold">{chefDeGroupeName}</p>
                      <p className="text-blue-600">{vanReference}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
              {canTerminate && onTerminateClick && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTerminateClick(mission);
                  }}
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 bg-orange-50 text-orange-600 hover:bg-orange-100"
                  title="Terminer la mission"
                  disabled={actionLoading === 'loading'}
                >
                  <StopCircle className="h-4 w-4" />
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

      {/* Companies Section */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-semibold text-gray-900">
            {mission.companies_data && Array.isArray(mission.companies_data) && mission.companies_data.length > 1 
              ? `Entreprises (${mission.companies_data.length})` 
              : 'Entreprise'
            }
          </span>
        </div>

        <div className="space-y-2">
          {mission.companies_data && Array.isArray(mission.companies_data) && mission.companies_data.length > 0 ? (
            mission.companies_data.map((company, index) => (
              <Card key={index} className="transition-all duration-200 hover:shadow-sm border-gray-100">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-4 w-4 text-blue-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          variant="secondary" 
                          className="bg-blue-100 text-blue-800 border-blue-200 font-medium text-xs"
                        >
                          {company.companyName}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="font-medium">{company.branchName}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="transition-all duration-200 hover:shadow-sm border-gray-100">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-4 w-4 text-blue-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge 
                        variant="secondary" 
                        className="bg-blue-100 text-blue-800 border-blue-200 font-medium text-xs"
                      >
                        {mission.company}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="font-medium">{mission.branch}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Mission Information Section */}
      <div className="px-6 py-4 bg-gray-50">
        <div className="grid grid-cols-1 gap-3">
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
