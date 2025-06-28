
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  StopCircle, 
  Truck, 
  User, 
  Building,
  MapPin,
  Calendar,
  Clock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Trip } from '@/contexts/TripContext';
import { formatDate } from '@/utils/dateUtils';

interface MissionCardProps {
  mission: Trip;
  onEdit: (mission: Trip) => void;
  onDelete: (mission: Trip) => void;
  onTerminate: (mission: Trip) => void;
  canEdit: boolean;
  canDelete: boolean;
  actionLoading: string | null;
}

const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  onEdit,
  onDelete,
  onTerminate,
  canEdit,
  canDelete,
  actionLoading,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Terminée</Badge>;
      case 'terminated':
        return <Badge className="bg-red-100 text-red-800">Annulée</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Inconnu</Badge>;
    }
  };

  const canTerminate = mission.status === 'active';
  const isLoading = actionLoading === 'loading';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
              {mission.company}
            </CardTitle>
            <p className="text-sm text-gray-600 mb-2">{mission.branch}</p>
            {getStatusBadge(mission.status || 'active')}
          </div>
          
          {(canEdit || canDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canEdit && (
                  <DropdownMenuItem onClick={() => onEdit(mission)} disabled={isLoading}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Modifier
                  </DropdownMenuItem>
                )}
                {canDelete && canTerminate && (
                  <DropdownMenuItem onClick={() => onTerminate(mission)} disabled={isLoading}>
                    <StopCircle className="mr-2 h-4 w-4" />
                    Terminer
                  </DropdownMenuItem>
                )}
                {canDelete && (
                  <DropdownMenuItem 
                    onClick={() => onDelete(mission)} 
                    disabled={isLoading}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <User className="h-4 w-4 mr-2 text-gray-400" />
          <span>Chauffeur: {mission.driver}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Truck className="h-4 w-4 mr-2 text-gray-400" />
          <span>Véhicule: {mission.van}</span>
        </div>

        {(mission.planned_start_date || mission.startDate) && (
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span>Début: {formatDate(mission.planned_start_date || mission.startDate!)}</span>
          </div>
        )}

        {(mission.planned_end_date || mission.endDate) && (
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-gray-400" />
            <span>Fin: {formatDate(mission.planned_end_date || mission.endDate!)}</span>
          </div>
        )}

        {(mission.start_km || mission.startKm) && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            <span>Km début: {mission.start_km || mission.startKm}</span>
            {(mission.end_km || mission.endKm) && <span className="ml-2">- Km fin: {mission.end_km || mission.endKm}</span>}
          </div>
        )}

        {mission.notes && (
          <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
            <strong>Notes:</strong> {mission.notes}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MissionCard;
