
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Truck, 
  Calendar, 
  Users, 
  MapPin, 
  FileText, 
  Clock,
  Building2,
  User
} from 'lucide-react';
import { Trip } from '@/contexts/TripContext';
import { formatDateOnly } from '@/utils/dateUtils';

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
  getVanDisplayName
}) => {
  if (!mission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Détails de la Mission
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Company */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{mission.company}</h3>
              <p className="text-gray-600">{mission.branch}</p>
            </div>
            <Badge 
              variant={mission.status === 'active' ? 'default' : 'secondary'}
              className={mission.status === 'active' 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-gray-500'
              }
            >
              {mission.status === 'active' ? 'En Mission' : 'Terminé'}
            </Badge>
          </div>

          <Separator />

          {/* Mission Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Véhicule
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="font-medium">{getVanDisplayName(mission.van)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Conducteur
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="font-medium">{mission.driver}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date de Création
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="font-medium">{formatDateOnly(mission.timestamp)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Équipe
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="font-medium">{mission.userIds?.length || 0} membres</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Kilométrage Début
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="font-medium">{mission.startKm || 0} km</p>
              </CardContent>
            </Card>

            {mission.endKm && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Kilométrage Fin
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="font-medium">{mission.endKm} km</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Planned Dates */}
          {(mission.startDate || mission.endDate) && (
            <>
              <Separator />
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Dates Planifiées
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {mission.startDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Début:</span>
                        <span className="font-medium">{formatDateOnly(mission.startDate.toISOString())}</span>
                      </div>
                    )}
                    {mission.endDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fin:</span>
                        <span className="font-medium">{formatDateOnly(mission.endDate.toISOString())}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Notes */}
          {mission.notes && (
            <>
              <Separator />
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-700 whitespace-pre-wrap">{mission.notes}</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MissionDetailsDialog;
