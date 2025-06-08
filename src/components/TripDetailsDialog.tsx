
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, MapIcon, User, Truck, Building2, StickyNote, Users } from 'lucide-react';
import { Trip } from '@/contexts/TripContext';
import { useRBAC } from '@/contexts/RBACContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatDateTimeParts, getTimeAgo } from '@/utils/dateUtils';

interface TripDetailsDialogProps {
  trip: Trip | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TripDetailsDialog: React.FC<TripDetailsDialogProps> = ({
  trip,
  open,
  onOpenChange,
}) => {
  const { users, getUserGroup } = useRBAC();
  const { t } = useLanguage();

  if (!trip) return null;

  // Get employees who worked on this trip
  const tripEmployees = users.filter(user => 
    trip.userIds.includes(user.id.toString())
  );

  const { date, time } = formatDateTimeParts(trip.timestamp);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Truck className="h-5 w-5" />
            <span>Détails du Voyage</span>
            <Badge variant="outline" className="font-mono">
              #{trip.id}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Van and Driver Information */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Truck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ID Camionnette</p>
                    <p className="font-semibold text-lg">{trip.van}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <User className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Chauffeur</p>
                    <p className="font-semibold text-lg">{trip.driver}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Building2 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Entreprise</p>
                    <p className="font-semibold text-lg">{trip.company}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <MapIcon className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Succursale</p>
                    <p className="font-semibold text-lg">{trip.branch}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employees Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Users className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-3">Employés sur le Voyage</p>
                  {tripEmployees.length > 0 ? (
                    <div className="space-y-3">
                      {tripEmployees.map((employee) => {
                        const group = getUserGroup(employee.groupId);
                        return (
                          <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-gray-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{employee.name}</p>
                                <p className="text-sm text-gray-500">{employee.role}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant="outline" 
                                style={{ 
                                  backgroundColor: group?.color + '20',
                                  borderColor: group?.color,
                                  color: group?.color 
                                }}
                              >
                                {group?.name}
                              </Badge>
                              <Badge 
                                variant={employee.status === 'Active' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {t.userStatus[employee.status === 'Active' ? 'active' : employee.status === 'Recovery' ? 'recovery' : employee.status === 'Leave' ? 'leave' : 'sickLeave']}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Aucun employé assigné à ce voyage</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time Information */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold">{date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <Clock className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Heure</p>
                    <p className="font-semibold">{time}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Clock className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Il y a</p>
                    <p className="font-semibold">{getTimeAgo(trip.timestamp)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes Section */}
          {trip.notes && (
            <>
              <Separator />
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <StickyNote className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-2">{t.notes}</p>
                      <p className="text-gray-800 leading-relaxed">{trip.notes}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Trip Summary */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="font-semibold text-lg text-blue-800 mb-2">Résumé du Voyage</h3>
                <p className="text-blue-600">
                  {trip.driver} a terminé un voyage vers {trip.branch} ({trip.company}) avec la camionnette {trip.van}
                  {tripEmployees.length > 0 && ` avec ${tripEmployees.length} employé${tripEmployees.length === 1 ? '' : 's'}`}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TripDetailsDialog;
