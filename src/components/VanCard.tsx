
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Car, 
  MapPin, 
  Route, 
  Fuel, 
  Edit, 
  Eye, 
  TrendingUp, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';
import { getStatusColor, getFuelLevelColor, getEfficiencyColor } from '@/utils/vanUtils';

interface VanCardProps {
  van: any;
  onEdit: (van: any) => void;
  onQuickAction: (action: string, van: any) => void;
}

const VanCard = ({ van, onEdit, onQuickAction }: VanCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
      {/* Van Image */}
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <img 
          src={van.image} 
          alt={`${van.model} - ${van.license_plate}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <Badge className={getStatusColor(van.status)}>
            {van.status}
          </Badge>
        </div>
        {van.fuelLevel <= 25 && (
          <div className="absolute top-3 left-3">
            <Badge variant="destructive" className="text-xs">
              <Fuel className="h-3 w-3 mr-1" />
              Carburant Bas
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{van.license_plate}</CardTitle>
            <p className="text-sm text-gray-600">{van.model}</p>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className={`h-4 w-4 ${getEfficiencyColor(van.efficiency)}`} />
            <span className={`text-sm font-medium ${getEfficiencyColor(van.efficiency)}`}>
              {van.efficiency}%
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Car className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">{van.carNumberPlate}</span>
        </div>

        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-sm truncate">{van.currentLocation}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Fuel className={`h-4 w-4 ${getFuelLevelColor(van.fuelLevel)}`} />
            <span className={`text-sm ${getFuelLevelColor(van.fuelLevel)}`}>
              {van.fuelLevel}%
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Route className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{van.totalTrips} voyages</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div>
            <span className="font-medium">Chauffeur:</span> {van.driver}
          </div>
          <div>
            <span className="font-medium">Kilométrage:</span> {van.mileage}
          </div>
          <div>
            <span className="font-medium">Dernier Voyage:</span> {van.lastTrip}
          </div>
          <div className="flex items-center">
            <span className="font-medium">Maintenance:</span>
            {van.nextMaintenance === 'En Cours' ? (
              <AlertTriangle className="h-3 w-3 ml-1 text-orange-500" />
            ) : (
              <Clock className="h-3 w-3 ml-1 text-gray-400" />
            )}
          </div>
        </div>

        {/* Progress Bar for Fuel */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Niveau de Carburant</span>
            <span className={getFuelLevelColor(van.fuelLevel)}>{van.fuelLevel}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${
                van.fuelLevel > 50 ? 'bg-green-500' : 
                van.fuelLevel > 25 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${van.fuelLevel}%` }}
            ></div>
          </div>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(van)}
            className="flex-1"
          >
            <Edit className="h-3 w-3 mr-1" />
            Modifier
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onQuickAction('Voir Voyages', van)}
            className="flex-1"
          >
            <Eye className="h-3 w-3 mr-1" />
            Voyages
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onQuickAction('Suivre', van)}
            className="px-2"
          >
            <MapPin className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VanCard;
