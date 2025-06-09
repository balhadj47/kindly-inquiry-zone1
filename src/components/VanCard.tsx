
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Car, 
  Edit, 
  Eye, 
  Trash2,
  Shield,
  Calendar,
  FileText
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { getStatusColor } from '@/utils/vanUtils';
import { format } from 'date-fns';

interface VanCardProps {
  van: any;
  onEdit: (van: any) => void;
  onQuickAction: (action: string, van: any) => void;
  onDelete: (van: any) => void;
}

const VanCard = ({ van, onEdit, onQuickAction, onDelete }: VanCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{van.license_plate}</CardTitle>
            <p className="text-sm text-gray-600">{van.model}</p>
          </div>
          {van.status && (
            <Badge className={getStatusColor(van.status)}>
              {van.status}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Car className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">Chauffeur: {van.driver}</span>
        </div>

        {van.insurer && (
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-gray-500" />
            <span className="text-sm">Assureur: {van.insurer}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs">
          {van.insurance_date && (
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3 text-gray-400" />
              <span>Assurance: {format(new Date(van.insurance_date), 'dd/MM/yyyy')}</span>
            </div>
          )}
          {van.control_date && (
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3 text-gray-400" />
              <span>Contrôle: {format(new Date(van.control_date), 'dd/MM/yyyy')}</span>
            </div>
          )}
        </div>

        {van.notes && (
          <div className="flex items-start space-x-2">
            <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
            <p className="text-sm text-gray-600 line-clamp-2">{van.notes}</p>
          </div>
        )}
        
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer la camionnette</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer la camionnette "{van.license_plate}" ? 
                  Cette action ne peut pas être annulée.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(van)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default VanCard;
