
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Clock, MapPin, Users, Car, Building2, FileText, User } from 'lucide-react';
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAssignedUsers = () => {
    if (!trip.userIds || trip.userIds.length === 0) return [];
    
    return trip.userIds.map(userId => {
      const user = users.find(u => u.id.toString() === userId);
      return user || null;
    }).filter(Boolean);
  };

  const assignedUsers = getAssignedUsers();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Car className="h-5 w-5" />
            <span>Détails du Voyage #{trip.id}</span>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Date and Time */}
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Date de création</p>
                <p className="text-sm text-muted-foreground">{formatDate(trip.createdAt)}</p>
              </div>
            </div>

            <Separator />

            {/* Vehicle and Driver */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Car className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Véhicule</p>
                  <p className="text-sm text-muted-foreground">{trip.van}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Chauffeur</p>
                  <p className="text-sm text-muted-foreground">{trip.driver}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Company and Branch */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Entreprise</p>
                  <p className="text-sm text-muted-foreground">{trip.company}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Agence</p>
                  <p className="text-sm text-muted-foreground">{trip.branch}</p>
                </div>
              </div>
            </div>

            {/* Assigned Users */}
            {assignedUsers.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <p className="font-medium">Utilisateurs assignés ({assignedUsers.length})</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {assignedUsers.map((user) => (
                      <div key={user.id} className="flex items-center space-x-2 p-2 bg-muted rounded-md">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.role}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {user.status}
                        </Badge>
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
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <p className="font-medium">Notes</p>
                  </div>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm whitespace-pre-wrap">{trip.notes}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TripDetailsDialog;
