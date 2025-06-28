
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
      className="text-xs"
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
  
  console.log('🎯 MissionDetailsDialog: Rendering with mission:', mission?.id || 'null');

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
        <DialogContent>
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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'terminated':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Mission Active';
      case 'completed':
        return 'Mission Terminée';
      case 'terminated':
        return 'Mission Annulée';
      default:
        return 'Statut Inconnu';
    }
  };

  const vanInfo = getVanInfo(mission.van);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Mission - {mission.company}
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            Informations détaillées de la mission assignée
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          {/* Status Badge */}
          <div className="flex justify-center">
            <Badge className={`px-6 py-3 text-sm font-semibold border ${getStatusColor(mission.status || 'active')}`}>
              {getStatusText(mission.status || 'active')}
            </Badge>
          </div>

          {/* Main Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Company Information */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <Building className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 mb-2">Entreprise</h3>
                    <p className="text-lg font-bold text-blue-800">{mission.company}</p>
                    <p className="text-blue-700 mt-1">Succursale: {mission.branch}</p>
                  </div>
                </div>
              </div>

              {/* Driver Information */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-start space-x-3">
                  <User className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-900 mb-2">Chauffeur Assigné</h3>
                    <p className="text-lg font-bold text-green-800">{mission.driver}</p>
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-start space-x-3">
                  <Truck className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-purple-900 mb-2">Véhicule Assigné</h3>
                    <p className="text-lg font-bold text-purple-800">{vanInfo.model}</p>
                    <p className="text-purple-700 mt-1">Plaque: {vanInfo.licensePlate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Date Information */}
              {(mission.planned_start_date || mission.startDate) && (
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-orange-900 mb-2">Dates de Mission</h3>
                      <div className="space-y-2">
                        <p className="text-orange-800">
                          <span className="font-medium">Début:</span> {formatDate(mission.planned_start_date || mission.startDate!)}
                        </p>
                        {(mission.planned_end_date || mission.endDate) && (
                          <p className="text-orange-800">
                            <span className="font-medium">Fin:</span> {formatDate(mission.planned_end_date || mission.endDate!)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Kilometer Information */}
              {(mission.start_km || mission.startKm) && (
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-indigo-900 mb-2">Kilométrage</h3>
                      <div className="space-y-2">
                        <p className="text-indigo-800">
                          <span className="font-medium">Début:</span> {mission.start_km || mission.startKm} km
                        </p>
                        {(mission.end_km || mission.endKm) && (
                          <p className="text-indigo-800">
                            <span className="font-medium">Fin:</span> {mission.end_km || mission.endKm} km
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Destination */}
              {mission.destination && (
                <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-6 w-6 text-teal-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-teal-900 mb-2">Destination</h3>
                      <p className="text-lg font-medium text-teal-800">{mission.destination}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes Section */}
          {mission.notes && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-start space-x-3">
                <FileText className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-900 mb-3">Notes de Mission</h3>
                  <p className="text-yellow-800 leading-relaxed">{mission.notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Team Information */}
          {mission.userRoles && mission.userRoles.length > 0 && (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-start space-x-3">
                <Users className="h-6 w-6 text-slate-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-4">Équipe Assignée</h3>
                  <div className="space-y-3">
                    {mission.userRoles.map((userRole, index) => (
                      <div key={index} className="bg-white p-3 rounded-md border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-900">{userRole.userId}</span>
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
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MissionDetailsDialog;
