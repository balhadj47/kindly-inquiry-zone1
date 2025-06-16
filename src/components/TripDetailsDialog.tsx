import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calendar, 
  Clock, 
  Truck, 
  Building2, 
  User, 
  MapPin, 
  FileText, 
  Users,
  Shield,
  Car
} from 'lucide-react';
import { type Trip } from '@/contexts/TripContext';
import { useRBAC } from '@/contexts/RBACContext';

interface TripDetailsDialogProps {
  trip: Trip | null;
  isOpen: boolean;
  onClose: () => void;
}

const TripDetailsDialog: React.FC<TripDetailsDialogProps> = ({
  trip,
  isOpen,
  onClose,
}) => {
  const { users } = useRBAC();

  if (!trip) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTripTitle = (trip: Trip) => {
    const driverFirstName = trip.driver.split(' ')[0];
    return `${trip.company} - ${trip.branch} - ${driverFirstName}`;
  };

  const getAssignedUsersWithRoles = () => {
    // If we have userRoles data, use that (new format)
    if (trip.userRoles && trip.userRoles.length > 0) {
      return trip.userRoles.map(userWithRole => {
        const user = users.find(u => u.id.toString() === userWithRole.userId);
        return {
          user: user || { id: userWithRole.userId, name: `User ${userWithRole.userId}`, role: 'Unknown' },
          missionRoles: userWithRole.roles
        };
      });
    }

    // Fallback to old format (just userIds without roles)
    if (trip.userIds && trip.userIds.length > 0) {
      return trip.userIds.map(userId => {
        const user = users.find(u => u.id.toString() === userId);
        return {
          user: user || { id: userId, name: `User ${userId}`, role: 'Unknown' },
          missionRoles: []
        };
      });
    }

    return [];
  };

  const assignedUsersWithRoles = getAssignedUsersWithRoles();

  console.log('Trip data:', trip);
  console.log('Assigned users with roles:', assignedUsersWithRoles);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {getTripTitle(trip)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Trip Information */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Informations du Programme
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{formatDate(trip.timestamp)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Heure</p>
                    <p className="font-medium">{formatTime(trip.timestamp)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-500">Camionnette</p>
                    <p className="font-medium">{trip.van}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Car className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-500">Chauffeur</p>
                    <p className="font-medium">{trip.driver}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company and Branch */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-indigo-600" />
                Destination
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="text-sm text-gray-500">Entreprise</p>
                    <p className="font-medium">{trip.company}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-500">Succursale</p>
                    <p className="font-medium">{trip.branch}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assigned Team */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-emerald-600" />
                Équipe Assignée ({assignedUsersWithRoles.length} personnes)
              </h3>
              
              {assignedUsersWithRoles.length === 0 ? (
                <p className="text-gray-500 italic">Aucun membre d'équipe assigné</p>
              ) : (
                <div className="space-y-3">
                  {assignedUsersWithRoles.map((userWithRoles, index) => (
                    <div key={userWithRoles.user.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <User className="h-4 w-4 text-gray-600" />
                        <div>
                          <p className="font-medium text-sm">{userWithRoles.user.name}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {userWithRoles.user.role}
                            </Badge>
                            {userWithRoles.missionRoles.map((missionRole, roleIndex) => (
                              <Badge key={roleIndex} variant="outline" className="text-xs">
                                {missionRole}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      {(userWithRoles.missionRoles.includes('Armé') || userWithRoles.missionRoles.includes('Chef de Groupe')) && (
                        <Shield className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          {trip.notes && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-gray-600" />
                  Notes
                </h3>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{trip.notes}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TripDetailsDialog;
