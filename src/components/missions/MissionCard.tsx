
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  Building, 
  MapPin, 
  Car,
  Edit,
  Trash2,
  StopCircle,
  Loader2
} from 'lucide-react';
import { Trip } from '@/contexts/TripContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MissionCardProps {
  mission: Trip;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onTerminate: (e: React.MouseEvent) => void;
  canEdit: boolean;
  canDelete: boolean;
  isDeleting?: boolean;
  isTerminating?: boolean;
  getVanDisplayName: (vanId: string) => string;
  getChefDeGroupeName: (mission: Trip) => string;
}

const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  onClick,
  onEdit,
  onDelete,
  onTerminate,
  canEdit,
  canDelete,
  isDeleting = false,
  isTerminating = false,
  getVanDisplayName,
  getChefDeGroupeName,
}) => {
  const handleTerminateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🎯 MissionCard: Terminate button clicked for mission:', mission.id);
    onTerminate(e);
  };

  const formatDate = (dateString: string | Date | null | undefined) => {
    if (!dateString) return 'Non défini';
    
    try {
      let date: Date;
      
      if (typeof dateString === 'string') {
        date = new Date(dateString);
      } else if (dateString instanceof Date) {
        date = dateString;
      } else {
        return 'Non défini';
      }
      
      if (isNaN(date.getTime())) {
        return 'Date invalide';
      }
      
      return format(date, 'dd/MM/yyyy HH:mm', { locale: fr });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date invalide';
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Actif</Badge>;
      case 'completed':
        return <Badge variant="secondary">Terminé</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const isActive = mission.status === 'active';
  const chefDeGroupe = getChefDeGroupeName(mission);

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg text-gray-900">
              Mission #{mission.id}
            </h3>
            {getStatusBadge(mission.status)}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Terminate Button - More Prominent for Active Missions */}
            {isActive && (
              <Button
                size="sm"
                variant="outline"
                className="border-orange-500 text-orange-600 hover:bg-orange-50 hover:border-orange-600"
                onClick={handleTerminateClick}
                disabled={isTerminating}
              >
                {isTerminating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <StopCircle className="w-4 h-4" />
                )}
                <span className="ml-1 text-xs font-medium">
                  {isTerminating ? 'Arrêt...' : 'Terminer'}
                </span>
              </Button>
            )}
            
            {canEdit && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onEdit}
                className="text-gray-600 hover:text-blue-600"
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
            
            {canDelete && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onDelete}
                disabled={isDeleting}
                className="text-gray-600 hover:text-red-600"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Building className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">Entreprise:</span>
            <span className="truncate">{mission.company}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">Agence:</span>
            <span className="truncate">{mission.branch}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <Car className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">Véhicule:</span>
            <span className="truncate">{getVanDisplayName(mission.van)}</span>
          </div>
          
          {chefDeGroupe && (
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium">Chef:</span>
              <span className="truncate">{chefDeGroupe}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-gray-600 md:col-span-2">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">Début:</span>
            <span>{formatDate(mission.startDate || mission.planned_start_date)}</span>
          </div>
          
          {mission.start_km && (
            <div className="text-gray-600">
              <span className="font-medium">Km initial:</span> {mission.start_km} km
            </div>
          )}
          
          {mission.end_km && (
            <div className="text-gray-600">
              <span className="font-medium">Km final:</span> {mission.end_km} km
            </div>
          )}
        </div>

        {mission.notes && (
          <div className="mt-3 p-2 bg-gray-50 rounded">
            <span className="font-medium text-gray-700">Notes:</span>
            <p className="text-gray-600 text-sm mt-1">{mission.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MissionCard;
