
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
  FileText
} from 'lucide-react';
import { Trip } from '@/contexts/TripContext';
import { formatDate } from '@/utils/dateUtils';

interface MissionDetailsDialogProps {
  mission: Trip | null;
  isOpen: boolean;
  onClose: () => void;
  getVanDisplayName: (vanId: string) => string;
}

const MissionDetailsDialog: React.FC<MissionDetailsDialogProps> = ({
  mission,
  isOpen,
  onClose,
  getVanDisplayName,
}) => {
  console.log('🎯 MissionDetailsDialog: Rendering with mission:', mission?.id || 'null');

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
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'terminated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        return 'Inconnu';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Détails de la Mission - {mission.company}
          </DialogTitle>
          <DialogDescription>
            Informations complètes sur la mission sélectionnée.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex justify-center">
            <Badge className={`px-4 py-2 text-sm font-medium ${getStatusColor(mission.status || 'active')}`}>
              {getStatusText(mission.status || 'active')}
            </Badge>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center">
                <Building className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <span className="font-medium text-gray-700">Entreprise:</span>
                  <p className="text-blue-600 font-medium">{mission.company}</p>
                </div>
              </div>

              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <span className="font-medium text-gray-700">Succursale:</span>
                  <p className="text-gray-900">{mission.branch}</p>
                </div>
              </div>

              <div className="flex items-center">
                <User className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <span className="font-medium text-gray-700">Chauffeur:</span>
                  <p className="text-blue-600 font-medium">{mission.driver}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Truck className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <span className="font-medium text-gray-700">Véhicule:</span>
                  <p className="text-purple-600 font-medium">{getVanDisplayName(mission.van)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {(mission.planned_start_date || mission.startDate) && (
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <span className="font-medium text-gray-700">Date de début:</span>
                    <p className="text-green-600 font-medium">
                      {formatDate(mission.planned_start_date || mission.startDate!)}
                    </p>
                  </div>
                </div>
              )}

              {(mission.planned_end_date || mission.endDate) && (
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <span className="font-medium text-gray-700">Date de fin:</span>
                    <p className="text-red-600 font-medium">
                      {formatDate(mission.planned_end_date || mission.endDate!)}
                    </p>
                  </div>
                </div>
              )}

              {(mission.start_km || mission.startKm) && (
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <span className="font-medium text-gray-700">Kilométrage:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600 font-medium">
                        Début: {mission.start_km || mission.startKm}
                      </span>
                      {(mission.end_km || mission.endKm) && (
                        <>
                          <span className="text-gray-400">→</span>
                          <span className="text-red-600 font-medium">
                            Fin: {mission.end_km || mission.endKm}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {mission.destination && (
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <span className="font-medium text-gray-700">Destination:</span>
                    <p className="text-orange-600 font-medium">{mission.destination}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {mission.notes && (
            <div className="border-t pt-4">
              <div className="flex items-start">
                <FileText className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <span className="font-medium text-gray-700">Notes:</span>
                  <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-700">{mission.notes}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Team Information */}
          {mission.userRoles && mission.userRoles.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-700 mb-3">Équipe assignée:</h3>
              <div className="space-y-2">
                {mission.userRoles.map((userRole, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">{userRole.userId}</span>
                    <div className="flex space-x-1">
                      {userRole.roles.map((role, roleIndex) => {
                        // Handle both object and string types for roles
                        const roleName = typeof role === 'string' ? role : role.name || 'Unknown Role';
                        const roleColor = typeof role === 'string' ? '#10B981' : role.color || '#10B981';
                        
                        return (
                          <Badge 
                            key={roleIndex} 
                            variant="outline" 
                            className="text-xs"
                            style={{ backgroundColor: roleColor, color: 'white' }}
                          >
                            {roleName}
                          </Badge>
                        );
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
