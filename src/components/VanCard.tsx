
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
  AlertTriangle
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
    <Card className="w-full h-full flex flex-col hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white border-0 shadow-md">
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {van.reference_code && (
              <span className="inline-block text-xs px-3 py-1 bg-blue-600 text-white rounded-full font-semibold uppercase mb-2 shadow-sm">
                {van.reference_code}
              </span>
            )}
            <CardTitle className="text-xl font-bold text-gray-900 truncate">{van.model}</CardTitle>
            <p className="text-sm font-medium text-gray-600 mt-1">{van.license_plate}</p>
          </div>
          {van.status && (
            <Badge className={`${getStatusColor(van.status)} shadow-sm font-medium`}>
              {van.status}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4 space-y-4">
        {van.insurer && (
          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
            <Shield className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Assureur: {van.insurer}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          {van.insurance_date && (
            <div className={`flex items-center space-x-2 p-2 rounded-lg ${isInsuranceExpired ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
              <Calendar className={`h-4 w-4 ${isInsuranceExpired ? 'text-red-600' : 'text-green-600'}`} />
              <div className="flex-1">
                <span className={`text-sm font-medium ${isInsuranceExpired ? 'text-red-800' : 'text-green-800'}`}>
                  Assurance: {format(new Date(van.insurance_date), 'dd/MM/yyyy')}
                </span>
                {isInsuranceExpired && (
                  <div className="flex items-center space-x-1 mt-1">
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                    <span className="text-xs text-red-600 font-medium">Expirée</span>
                  </div>
                )}
              </div>
            </div>
          )}
          {van.control_date && (
            <div className={`flex items-center space-x-2 p-2 rounded-lg ${isControlExpired ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
              <Calendar className={`h-4 w-4 ${isControlExpired ? 'text-red-600' : 'text-green-600'}`} />
              <div className="flex-1">
                <span className={`text-sm font-medium ${isControlExpired ? 'text-red-800' : 'text-green-800'}`}>
                  Contrôle: {format(new Date(van.control_date), 'dd/MM/yyyy')}
                </span>
                {isControlExpired && (
                  <div className="flex items-center space-x-1 mt-1">
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                    <span className="text-xs text-red-600 font-medium">Expiré</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {van.notes && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <FileText className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800 line-clamp-3 leading-relaxed">{van.notes}</p>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2 mt-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="flex-1 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200"
          >
            <Edit className="h-3 w-3 mr-1" />
            Modifier
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleQuickAction}
            className="flex-1 hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-200"
          >
            <Eye className="h-3 w-3 mr-1" />
            Voyages
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 px-3 transition-all duration-200"
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
