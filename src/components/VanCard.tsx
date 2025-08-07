
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Edit, Trash2, Navigation } from 'lucide-react';
import { Van } from '@/types/van';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';

interface VanCardProps {
  van: Van;
  onEdit: (van: Van) => void;
  onQuickAction: (van: Van) => void;
  onDelete: (van: Van) => void;
}

const VanCard: React.FC<VanCardProps> = ({ van, onEdit, onQuickAction, onDelete }) => {
  const { canUpdateVans, canDeleteVans } = usePermissionCheck();

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'En Transit':
        return 'destructive';
      case 'Maintenance':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'En Transit':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Maintenance':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return '';
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer border-gray-200 hover:border-blue-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <CardTitle className="text-lg font-semibold text-gray-900 leading-tight line-clamp-2 hover:text-primary transition-colors">
                    {van.model || 'Modèle non spécifié'}
                  </CardTitle>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{van.model || 'Modèle non spécifié'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p className="text-sm text-gray-600 mt-1 truncate">
              {van.license_plate || 'Plaque non spécifiée'}
            </p>
          </div>
          
          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            <Badge 
              variant={getStatusBadgeVariant(van.status)}
              className={`text-xs font-medium ${getStatusBadgeColor(van.status)}`}
            >
              {van.status}
            </Badge>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onQuickAction(van)}
                className="h-8 w-8 p-0"
              >
                <Navigation className="h-4 w-4" />
              </Button>
              {canUpdateVans && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(van)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {canDeleteVans && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(van)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center text-sm">
            <span className="text-gray-600 mr-2">Kilométrage:</span>
            <span className="font-medium text-gray-900 truncate">
              {van.mileage ? `${van.mileage.toLocaleString()} km` : 'Non spécifié'}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-gray-600 mr-2">Capacité:</span>
            <span className="font-medium text-gray-900 truncate">
              {van.capacity || 'Non spécifiée'}
            </span>
          </div>
          {van.last_maintenance && (
            <div className="flex items-center text-sm">
              <span className="text-gray-600 mr-2">Maintenance:</span>
              <span className="font-medium text-gray-900 truncate">
                {new Date(van.last_maintenance).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VanCard;
