
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Truck, 
  Building, 
  MapPin, 
  Calendar,
  FileText,
  Users,
  Circle
} from 'lucide-react';
import { Trip } from '@/contexts/TripContext';
import { formatDate } from '@/utils/dateUtils';
import { useVans } from '@/hooks/useVansOptimized';
import { useRoleData } from '@/hooks/useRoleData';
import { useUsers } from '@/hooks/useUsersOptimized';

interface MissionDetailsDialogProps {
  mission: Trip | null;
  isOpen: boolean;
  onClose: () => void;
  getVanDisplayName: (vanId: string) => string;
}

const TeamMemberRole: React.FC<{ roleId: number }> = ({ roleId }) => {
  const { roleName, roleColor } = useRoleData(roleId);
  
  return (
    <Badge 
      variant="outline" 
      className="text-xs px-2 py-1 bg-gray-50 text-gray-700 border-gray-200"
    >
      {roleName}
    </Badge>
  );
};

const MissionDetailsDialog: React.FC<MissionDetailsDialogProps> = ({
  mission,
  isOpen,
  onClose,
  getVanDisplayName,
}) => {
  const { data: vans = [] } = useVans();
  const { data: usersData } = useUsers();
  const users = usersData?.users || [];
  
  console.log('🎯 MissionDetailsDialog: Rendering with mission:', mission?.id || 'null');

  // Function to get user name by ID with proper type handling
  const getUserName = (userId: string) => {
    const user = users.find(u => {
      const userIdStr = u.id.toString();
      return userIdStr === userId;
    });
    return user ? user.name : `User ${userId}`;
  };

  // Local function to get van display info with separate model and plate
  const getVanInfo = (vanId: string) => {
    const van = vans.find(v => v.id === vanId || v.reference_code === vanId);
    if (van) {
      return {
        model: van.model || 'Modèle inconnu',
        licensePlate: van.license_plate || 'Plaque inconnue'
      };
    }
    return {
      model: getVanDisplayName(vanId) || vanId,
      licensePlate: 'Information non disponible'
    };
  };

  if (!mission) {
    console.log('🎯 MissionDetailsDialog: No mission provided');
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Détails de la Mission</DialogTitle>
            <DialogDescription>
              Aucune mission sélectionnée.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-emerald-600 bg-emerald-50';
      case 'completed':
        return 'text-blue-600 bg-blue-50';
      case 'terminated':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'completed':
        return 'Terminée';
      case 'terminated':
        return 'Annulée';
      default:
        return 'Statut Inconnu';
    }
  };

  const vanInfo = getVanInfo(mission.van);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-8">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-semibold text-gray-900">
                {mission.company}
              </DialogTitle>
              <DialogDescription className="text-base text-gray-600">
                {mission.branch}
              </DialogDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Circle className={`h-3 w-3 fill-current ${
                mission.status === 'active' ? 'text-emerald-500' : 
                mission.status === 'completed' ? 'text-blue-500' : 
                mission.status === 'terminated' ? 'text-red-500' : 'text-gray-500'
              }`} />
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(mission.status || 'active')}`}>
                {getStatusText(mission.status || 'active')}
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-8">
          {/* Key Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Driver */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Chauffeur</p>
                  <p className="text-lg font-semibold text-gray-900">{mission.driver}</p>
                </div>
              </div>
            </div>

            {/* Vehicle */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                  <Truck className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Véhicule</p>
                  <p className="text-lg font-semibold text-gray-900">{vanInfo.model}</p>
                  <p className="text-sm text-gray-600">{vanInfo.licensePlate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline & Distance */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Informations du Voyage</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Dates */}
              {(mission.planned_start_date || mission.startDate) && (
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mt-1">
                    <Calendar className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Période</p>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Début:</span> {formatDate(mission.planned_start_date || mission.startDate!)}
                      </p>
                      {(mission.planned_end_date || mission.endDate) && (
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">Fin:</span> {formatDate(mission.planned_end_date || mission.endDate!)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Kilometers */}
              {(mission.start_km || mission.startKm) && (
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mt-1">
                    <MapPin className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Distance</p>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Km début:</span> {mission.start_km || mission.startKm}
                      </p>
                      {(mission.end_km || mission.endKm) && (
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">Km fin:</span> {mission.end_km || mission.endKm}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Destination */}
          {mission.destination && (
            <div className="border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Destination</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{mission.destination}</p>
            </div>
          )}

          {/* Notes */}
          {mission.notes && (
            <div className="border border-amber-200 bg-amber-50 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="h-5 w-5 text-amber-600" />
                <h3 className="text-lg font-semibold text-amber-800">Notes</h3>
              </div>
              <p className="text-amber-800 leading-relaxed">{mission.notes}</p>
            </div>
          )}

          {/* Team */}
          {mission.userRoles && mission.userRoles.length > 0 && (
            <div className="border border-blue-200 bg-blue-50 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Users className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-800">Équipe Assignée</h3>
              </div>
              <div className="space-y-4">
                {mission.userRoles.map((userRole, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {getUserName(userRole.userId)}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {userRole.roles.map((role, roleIndex) => {
                            if (typeof role === 'string') {
                              return (
                                <Badge key={roleIndex} variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                                  {role}
                                </Badge>
                              );
                            } else if (typeof role === 'object' && role !== null) {
                              const roleObj = role as any;
                              if (roleObj.role_id) {
                                return <TeamMemberRole key={roleIndex} roleId={roleObj.role_id} />;
                              }
                              return (
                                <Badge 
                                  key={roleIndex} 
                                  variant="outline" 
                                  className="text-xs bg-gray-50 text-gray-700 border-gray-200"
                                >
                                  {roleObj.name || 'Rôle Inconnu'}
                                </Badge>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MissionDetailsDialog;
