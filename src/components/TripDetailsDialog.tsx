
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Clock, MapPin, Users, Car, Building2, FileText, User, Hash, Timer, Shield } from 'lucide-react';
import { Trip } from '@/contexts/TripContext';
import { useRBAC } from '@/contexts/RBACContext';

interface TripDetailsDialogProps {
  trip: Trip | null;
  isOpen: boolean;
  onClose: () => void;
}

const TripDetailsDialog: React.FC<TripDetailsDialogProps> = ({ trip, isOpen, onClose }) => {
  const { users } = useRBAC();

  if (!trip) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFullDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDriverFirstName = (driverName: string) => {
    // Extract the first name from the driver's full name
    return driverName.split(' ')[0];
  };

  const getTripTitle = (trip: Trip) => {
    const driverFirstName = getDriverFirstName(trip.driver);
    return `${trip.company} - ${trip.branch} - ${driverFirstName}`;
  };

  const getAssignedUsers = () => {
    if (!trip.userIds || trip.userIds.length === 0) return [];
    
    return trip.userIds.map(userId => {
      const user = users.find(u => u.id.toString() === userId);
      return user || null;
    }).filter(Boolean);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Chef de Groupe Armé':
      case 'Chef de Groupe Sans Armé':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Chauffeur Armé':
      case 'Chauffeur Sans Armé':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'APS Armé':
      case 'APS Sans Armé':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const assignedUsers = getAssignedUsers();

  console.log('Trip driver:', trip.driver);
  console.log('Driver first name:', getDriverFirstName(trip.driver));
  console.log('Assigned users:', assignedUsers);
  console.log('Users from RBAC:', users);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center space-x-3 text-xl">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Car className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{getTripTitle(trip)}</h2>
              <p className="text-sm text-muted-foreground mt-1">Voyage #{trip.id}</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[65vh] pr-4">
          <div className="space-y-6">
            {/* Trip Overview Card */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Date</p>
                    <p className="text-sm text-gray-600">{formatDate(trip.timestamp)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Timer className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Heure</p>
                    <p className="text-sm text-gray-600">{formatTime(trip.timestamp)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Hash className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">ID Voyage</p>
                    <p className="text-sm text-gray-600">#{trip.id}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Vehicle Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Car className="h-5 w-5 text-blue-600" />
                <span>Informations du Véhicule</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Car className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-gray-900">Véhicule</p>
                      <p className="text-sm text-muted-foreground">{trip.van}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-gray-900">Chauffeur</p>
                      <p className="text-sm text-muted-foreground">{trip.driver}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-green-600" />
                <span>Informations de Destination</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-gray-900">Entreprise</p>
                      <p className="text-sm text-muted-foreground">{trip.company}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-gray-900">Agence</p>
                      <p className="text-sm text-muted-foreground">{trip.branch}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Assigned Users */}
            {assignedUsers.length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span>Utilisateurs Assignés ({assignedUsers.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {assignedUsers.map((user) => (
                      <div key={user.id} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className={`text-xs ${getRoleColor(user.role)}`}>
                              <Shield className="h-3 w-3 mr-1" />
                              {user.role}
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-white">
                              {user.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Notes */}
            {trip.notes && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-orange-600" />
                    <span>Notes</span>
                  </h3>
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{trip.notes}</p>
                  </div>
                </div>
              </>
            )}

            {/* Trip Timeline */}
            <Separator />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Clock className="h-5 w-5 text-indigo-600" />
                <span>Chronologie</span>
              </h3>
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Voyage créé</p>
                    <p className="text-xs text-muted-foreground">{formatFullDateTime(trip.timestamp)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TripDetailsDialog;
