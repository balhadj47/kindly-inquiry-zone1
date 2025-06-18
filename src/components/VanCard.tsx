
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Eye, 
  Trash2,
  Shield,
  Calendar,
  FileText,
  AlertTriangle,
  Car
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

const VanCard = React.memo(({ van, onEdit, onQuickAction, onDelete }: VanCardProps) => {
  const handleEdit = React.useCallback(() => onEdit(van), [onEdit, van]);
  const handleQuickAction = React.useCallback(() => onQuickAction('Voir Voyages', van), [onQuickAction, van]);
  const handleDelete = React.useCallback(() => onDelete(van), [onDelete, van]);

  // Check if dates are expired
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const insuranceDate = van.insurance_date ? new Date(van.insurance_date) : null;
  const controlDate = van.control_date ? new Date(van.control_date) : null;
  
  const isInsuranceExpired = insuranceDate && insuranceDate < today;
  const isControlExpired = controlDate && controlDate < today;

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] focus:outline focus:ring-2 focus:ring-ring">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Car className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg">{van.model}</CardTitle>
              <p className="text-sm font-medium text-gray-600 mt-1">{van.license_plate}</p>
              {van.reference_code && (
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  {van.reference_code}
                </div>
              )}
            </div>
          </div>
          {van.status && (
            <Badge className={`${getStatusColor(van.status)} font-medium`}>
              {van.status}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Insurance and Control Information */}
        <div className="space-y-2">
          {van.insurer && (
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">Assureur: {van.insurer}</span>
            </div>
          )}
          
          {van.insurance_date && (
            <div className="flex items-center space-x-2">
              <Calendar className={`h-4 w-4 flex-shrink-0 ${isInsuranceExpired ? 'text-red-500' : 'text-green-500'}`} />
              <span className={`text-sm ${isInsuranceExpired ? 'text-red-700' : 'text-gray-700'}`}>
                Assurance: {format(new Date(van.insurance_date), 'dd/MM/yyyy')}
                {isInsuranceExpired && (
                  <span className="ml-1 text-red-600 font-medium">(Expirée)</span>
                )}
              </span>
            </div>
          )}
          
          {van.control_date && (
            <div className="flex items-center space-x-2">
              <Calendar className={`h-4 w-4 flex-shrink-0 ${isControlExpired ? 'text-red-500' : 'text-green-500'}`} />
              <span className={`text-sm ${isControlExpired ? 'text-red-700' : 'text-gray-700'}`}>
                Contrôle: {format(new Date(van.control_date), 'dd/MM/yyyy')}
                {isControlExpired && (
                  <span className="ml-1 text-red-600 font-medium">(Expiré)</span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Notes */}
        {van.notes && (
          <div className="border-t pt-3">
            <div className="flex items-start space-x-2">
              <FileText className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700 line-clamp-2">{van.notes}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => { e.stopPropagation(); handleEdit(); }}
            className="flex-1"
          >
            <Edit className="h-3 w-3 mr-1" />
            Modifier
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => { e.stopPropagation(); handleQuickAction(); }}
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
                onClick={(e) => e.stopPropagation()}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3"
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
                  onClick={handleDelete}
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
});

VanCard.displayName = 'VanCard';

export default VanCard;
