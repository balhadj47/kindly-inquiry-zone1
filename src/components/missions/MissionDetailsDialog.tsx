
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
  Clock,
  FileText,
  Users
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
      className="text-xs px-2 py-1"
      style={{ backgroundColor: roleColor, color: 'white', borderColor: roleColor }}
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

  // Function to get user name by ID
  const getUserName = (userId: string) => {
    const user = users.find(u => u.id.toString() === userId || u.id === parseInt(userId));
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
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'terminated':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4 pb-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {mission.company}
              </DialogTitle>
              <DialogDescription className="text-base text-gray-600">
                {mission.branch}
              </DialogDescription>
            </div>
            <Badge className={`px-4 py-2 text-sm font-medium rounded-full ${getStatusColor(mission.status || 'active')}`}>
              {getStatusText(mission.status || 'active')}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-8">
          {/* Basic Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Driver */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Chauffeur</p>
                  <p className="text-lg font-semibold text-gray-900">{mission.driver}</p>
                </div>
              </div>
            </div>

            {/* Vehicle */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Truck className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Véhicule</p>
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-gray-900">{vanInfo.model}</p>
                    <p className="text-sm text-gray-600">{vanInfo.licensePlate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dates */}
            {(mission.planned_start_date || mission.startDate) && (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Dates</p>
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
              </div>
            )}

            {/* Kilometers */}
            {(mission.start_km || mission.startKm) && (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Kilométrage</p>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Début:</span> {mission.start_km || mission.startKm} km
                      </p>
                      {(mission.end_km || mission.endKm) && (
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">Fin:</span> {mission.end_km || mission.endKm} km
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Destination */}
          {mission.destination && (
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-indigo-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Destination</h3>
              </div>
              <p className="text-lg text-gray-900 ml-11">{mission.destination}</p>
            </div>
          )}

          {/* Notes */}
          {mission.notes && (
            <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <FileText className="h-4 w-4 text-amber-600" />
                </div>
                <h3 className="text-sm font-medium text-amber-700 uppercase tracking-wide">Notes</h3>
              </div>
              <p className="text-gray-900 leading-relaxed ml-11">{mission.notes}</p>
            </div>
          )}

          {/* Team */}
          {mission.userRoles && mission.userRoles.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="text-sm font-medium text-blue-700 uppercase tracking-wide">Équipe Assignée</h3>
              </div>
              <div className="space-y-4 ml-11">
                {mission.userRoles.map((userRole, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg">
                            {getUserName(userRole.userId)}
                          </h4>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {userRole.roles.map((role, roleIndex) => {
                              if (typeof role === 'string') {
                                return (
                                  <Badge key={roleIndex} variant="outline" className="text-xs">
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
                                    className="text-xs px-3 py-1"
                                    style={{ 
                                      backgroundColor: roleObj.color || '#3B82F6', 
                                      color: 'white',
                                      borderColor: roleObj.color || '#3B82F6'
                                    }}
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
