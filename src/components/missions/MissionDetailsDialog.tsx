import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Truck, 
  Building, 
  MapPin, 
  Calendar,
  FileText,
  Users,
  Circle,
  CheckCircle,
  X
} from 'lucide-react';
import { Trip } from '@/contexts/TripContext';
import { formatDate } from '@/utils/dateUtils';
import { useVans } from '@/hooks/useVansOptimized';
import { useRoleData } from '@/hooks/useRoleData';
import { useUsers } from '@/hooks/useUsersOptimized';
import { useTripMutations } from '@/hooks/trips/useTripMutations';
import { useToast } from '@/hooks/use-toast';

interface MissionDetailsDialogProps {
  mission: Trip | null;
  isOpen: boolean;
  onClose: () => void;
  getVanDisplayName: (vanId: string) => string;
}

const TeamMemberRole: React.FC<{ roleId: number }> = ({ roleId }) => {
  const { roleName, roleColor } = useRoleData(roleId);
  
  return (
    <Badge variant="outline" className="text-xs px-2 py-1 bg-gray-50 text-gray-700 border-gray-200">
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
  const [showCompleteForm, setShowCompleteForm] = useState(false);
  const [finalKm, setFinalKm] = useState('');
  const [isCompleting, setIsCompleting] = useState(false);
  
  const { data: vans = [] } = useVans();
  const { data: usersData } = useUsers();
  const users = usersData?.users || [];
  const { updateTrip } = useTripMutations();
  const { toast } = useToast();
  
  console.log('🎯 MissionDetailsDialog: Rendering with mission:', mission?.id || 'null');
  console.log('🎯 Mission status:', mission?.status);
  console.log('🎯 Mission start_km:', mission?.start_km);
  console.log('🎯 Mission end_km:', mission?.end_km);

  // Function to get user name by ID with proper type handling
  const getUserName = (userId: string) => {
    const user = users.find(u => {
      const userIdStr = u.id.toString();
      return userIdStr === userId;
    });
    return user ? user.name : `User ${userId}`;
  };

  // Function to get the driver (person with "Chauffeur" role)
  const getDriverName = () => {
    if (!mission?.userRoles || mission.userRoles.length === 0) {
      return mission?.driver || 'Aucun chauffeur assigné';
    }

    // Find user with "Chauffeur" role
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

  const handleCompleteMission = async () => {
    if (!mission || !finalKm) {
      toast({
        title: 'Erreur',
        description: 'Veuillez saisir le kilométrage final',
        variant: 'destructive',
      });
      return;
    }

    const kmNumber = parseInt(finalKm, 10);
    if (isNaN(kmNumber) || kmNumber < 0) {
      toast({
        title: 'Erreur',
        description: 'Veuillez saisir un kilométrage valide',
        variant: 'destructive',
      });
      return;
    }

    if (mission.start_km && kmNumber < mission.start_km) {
      toast({
        title: 'Erreur',
        description: 'Le kilométrage final ne peut pas être inférieur au kilométrage initial',
        variant: 'destructive',
      });
      return;
    }

    setIsCompleting(true);
    try {
      console.log('🎯 Completing mission with data:', {
        id: mission.id,
        end_km: kmNumber,
        status: 'completed'
      });
      
      await updateTrip.mutateAsync({
        id: mission.id.toString(),
        end_km: kmNumber,
        status: 'completed'
      });
      
      toast({
        title: 'Succès',
        description: 'Mission terminée avec succès',
      });
      
      setShowCompleteForm(false);
      setFinalKm('');
      onClose();
    } catch (error) {
      console.error('Error completing mission:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de terminer la mission',
        variant: 'destructive',
      });
    } finally {
      setIsCompleting(false);
    }
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
        return 'text-emerald-600';
      case 'completed':
        return 'text-blue-600';
      case 'terminated':
        return 'text-red-600';
      default:
        return 'text-gray-600';
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
  const canComplete = mission.status === 'active';
  const driverName = getDriverName();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-semibold text-gray-900">
                {mission.company}
              </DialogTitle>
              <DialogDescription className="text-base text-gray-600">
                {mission.branch}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Circle className={`h-2.5 w-2.5 fill-current ${
                  mission.status === 'active' ? 'text-emerald-500' : 
                  mission.status === 'completed' ? 'text-blue-500' : 
                  mission.status === 'terminated' ? 'text-red-500' : 'text-gray-500'
                }`} />
                <span className={`text-sm font-medium ${getStatusColor(mission.status || 'active')}`}>
                  {getStatusText(mission.status || 'active')}
                </span>
              </div>
              {canComplete && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setShowCompleteForm(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Terminer Mission
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Complete Mission Form */}
        {showCompleteForm && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">Terminer la Mission</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowCompleteForm(false);
                  setFinalKm('');
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="finalKm" className="text-green-700 font-medium">
                  Kilométrage Final du Véhicule
                </Label>
                <Input
                  id="finalKm"
                  type="number"
                  placeholder="Entrez le kilométrage final"
                  value={finalKm}
                  onChange={(e) => setFinalKm(e.target.value)}
                  className="mt-2"
                  min={mission.start_km || 0}
                />
                {mission.start_km && (
                  <p className="text-sm text-green-600 mt-1">
                    Kilométrage initial: {mission.start_km} km
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleCompleteMission}
                  disabled={!finalKm || isCompleting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isCompleting ? 'Finalisation...' : 'Confirmer Finalisation'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCompleteForm(false);
                    setFinalKm('');
                  }}
                >
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Mission Overview */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations Générales</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Chauffeur</p>
                  <p className="text-base font-medium text-gray-900">{driverName}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                  <Truck className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Véhicule</p>
                  <p className="text-base font-medium text-gray-900">{vanInfo.model}</p>
                  <p className="text-sm text-gray-600">{vanInfo.licensePlate}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <Building className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Entreprise</p>
                  <p className="text-base font-medium text-gray-900">{mission.company}</p>
                  <p className="text-sm text-gray-600">{mission.branch}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date de Création</p>
                  <p className="text-base font-medium text-gray-900">
                    {formatDate(mission.timestamp || mission.created_at || new Date().toISOString())}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline & Distance */}
          {((mission.planned_start_date || mission.startDate) || (mission.start_km || mission.startKm)) && (
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Planification & Kilométrage</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Planned Dates */}
                {(mission.planned_start_date || mission.startDate) && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium text-gray-700">Dates Planifiées</h4>
                    </div>
                    <div className="space-y-2 pl-8">
                      <div>
                        <p className="text-sm text-gray-500">Début planifié</p>
                        <p className="text-base text-gray-900">
                          {formatDate(mission.planned_start_date || mission.startDate!)}
                        </p>
                      </div>
                      {(mission.planned_end_date || mission.endDate) && (
                        <div>
                          <p className="text-sm text-gray-500">Fin planifiée</p>
                          <p className="text-base text-gray-900">
                            {formatDate(mission.planned_end_date || mission.endDate!)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Kilometers */}
                {(mission.start_km || mission.startKm) && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-orange-600" />
                      <h4 className="font-medium text-gray-700">Kilométrage</h4>
                    </div>
                    <div className="space-y-2 pl-8">
                      <div>
                        <p className="text-sm text-gray-500">Km initial</p>
                        <p className="text-base text-gray-900">{mission.start_km || mission.startKm} km</p>
                      </div>
                      {(mission.end_km || mission.endKm) && (
                        <div>
                          <p className="text-sm text-gray-500">Km final</p>
                          <p className="text-base text-gray-900 font-semibold text-blue-600">
                            {mission.end_km || mission.endKm} km
                          </p>
                        </div>
                      )}
                      {(mission.start_km || mission.startKm) && (mission.end_km || mission.endKm) && (
                        <div>
                          <p className="text-sm text-gray-500">Distance parcourue</p>
                          <p className="text-base font-medium text-green-600">
                            {((mission.end_km || mission.endKm!) - (mission.start_km || mission.startKm!))} km
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Destination */}
          {mission.destination && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Destination</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{mission.destination}</p>
            </div>
          )}

          {/* Notes */}
          {mission.notes && (
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-5 w-5 text-amber-600" />
                <h3 className="text-lg font-semibold text-amber-800">Notes</h3>
              </div>
              <p className="text-amber-800 leading-relaxed">{mission.notes}</p>
            </div>
          )}

          {/* Team */}
          {mission.userRoles && mission.userRoles.length > 0 && (
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Users className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-800">Équipe Assignée</h3>
              </div>
              <div className="space-y-3">
                {mission.userRoles.map((userRole, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-blue-100">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 mb-2 truncate">
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
