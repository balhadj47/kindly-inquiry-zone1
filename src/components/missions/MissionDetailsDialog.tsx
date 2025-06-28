
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
import { useUsersOptimized } from '@/hooks/useUsersOptimized';

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
  const { data: users = [] } = useUsersOptimized();
  
  console.log('🎯 MissionDetailsDialog: Rendering with mission:', mission?.id || 'null');

  // Function to get user name by ID
  const getUserName = (userId: string) => {
    const user = users.find(u => u.id.toString() === userId || u.id === parseInt(userId));
    return user ? user.name : userId;
  };

  // Local function to get van display info with separate model and plate
  const getVanInfo = (vanId: string) => {
    const van = vans.find(v => v.id === vanId || v.reference_code === vanId);
    if (van) {
      return {
        model: van.model || 'Modèle inconnu',
        licensePlate: van.license_plate || 'Plaque non renseignée'
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
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'terminated':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                {mission.company}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-1">
                {mission.branch}
              </DialogDescription>
            </div>
            <Badge className={`px-3 py-1 text-sm font-medium ${getStatusColor(mission.status || 'active')}`}>
              {getStatusText(mission.status || 'active')}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Driver */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Chauffeur</span>
              </div>
              <p className="text-base text-gray-900 pl-6">{mission.driver}</p>
            </div>

            {/* Vehicle */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Truck className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Véhicule</span>
              </div>
              <div className="pl-6">
                <p className="text-base text-gray-900">{vanInfo.model}</p>
                <p className="text-sm text-gray-600">{vanInfo.licensePlate}</p>
              </div>
            </div>

            {/* Dates */}
            {(mission.planned_start_date || mission.startDate) && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Dates</span>
                </div>
                <div className="pl-6 space-y-1">
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
            )}

            {/* Kilometers */}
            {(mission.start_km || mission.startKm) && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Kilométrage</span>
                </div>
                <div className="pl-6 space-y-1">
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
            )}
          </div>

          {/* Destination */}
          {mission.destination && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Destination</span>
              </div>
              <p className="text-base text-gray-900 pl-6">{mission.destination}</p>
            </div>
          )}

          {/* Notes */}
          {mission.notes && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Notes</span>
              </div>
              <div className="pl-6">
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md leading-relaxed">
                  {mission.notes}
                </p>
              </div>
            </div>
          )}

          {/* Team */}
          {mission.userRoles && mission.userRoles.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Équipe Assignée</span>
              </div>
              <div className="pl-6 space-y-3">
                {mission.userRoles.map((userRole, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <span className="font-medium text-gray-900">
                      {getUserName(userRole.userId)}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {userRole.roles.map((role, roleIndex) => {
                        // Handle both object and string types for roles
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
                              className="text-xs"
                              style={{ 
                                backgroundColor: roleObj.color || '#10B981', 
                                color: 'white',
                                borderColor: roleObj.color || '#10B981'
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
