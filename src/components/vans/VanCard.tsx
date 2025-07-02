
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Edit, 
  Trash2,
  Calendar,
  FileText,
  Car,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { Van } from '@/types/van';

interface VanCardProps {
  van: Van;
  onEdit: (van: Van) => void;
  onDelete: (van: Van) => void;
  onClick: (van: Van) => void;
}

const VanCard: React.FC<VanCardProps> = ({ van, onEdit, onDelete, onClick }) => {
  // Check if dates are expired
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const insuranceDate = van.insurance_date ? new Date(van.insurance_date) : null;
  const controlDate = van.control_date ? new Date(van.control_date) : null;
  
  const isInsuranceExpired = insuranceDate && insuranceDate < today;
  const isControlExpired = controlDate && controlDate < today;
  const hasExpiredDocs = isInsuranceExpired || isControlExpired;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'en transit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onClick(van)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg text-gray-900">
                {van.model || 'Modèle non défini'}
              </h3>
              {hasExpiredDocs && (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium">{van.license_plate}</span>
              {van.insurer && (
                <Badge variant="outline" className="text-xs">
                  {van.insurer}
                </Badge>
              )}
            </div>
          </div>
          <Badge className={getStatusColor(van.status || 'Active')}>
            {van.status || 'Active'}
          </Badge>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Car className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Plaque:</span>
            <span className="font-medium">{van.license_plate || 'Non définie'}</span>
          </div>
          
          {van.reference_code && (
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Référence:</span>
              <span className="font-medium">{van.reference_code}</span>
            </div>
          )}
          
          {van.insurance_date && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className={`h-4 w-4 ${isInsuranceExpired ? 'text-red-500' : 'text-green-500'}`} />
              <span className="text-gray-600">Assurance:</span>
              <span className={`font-medium ${isInsuranceExpired ? 'text-red-600' : ''}`}>
                {format(new Date(van.insurance_date), 'dd/MM/yyyy')}
              </span>
            </div>
          )}
          
          {van.control_date && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className={`h-4 w-4 ${isControlExpired ? 'text-red-500' : 'text-green-500'}`} />
              <span className="text-gray-600">Contrôle:</span>
              <span className={`font-medium ${isControlExpired ? 'text-red-600' : ''}`}>
                {format(new Date(van.control_date), 'dd/MM/yyyy')}
              </span>
            </div>
          )}
        </div>

        {hasExpiredDocs && (
          <div className="mb-4">
            <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Documents expirés
            </Badge>
          </div>
        )}

        {van.notes && (
          <div className="mb-4 p-3 bg-blue-50/50 border border-blue-200/50 rounded-lg">
            <div className="flex items-start space-x-2">
              <FileText className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-blue-600 font-medium mb-1">Notes</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {van.notes.length > 100 ? `${van.notes.slice(0, 100)}...` : van.notes}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(van);
            }}
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(van);
            }}
            className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VanCard;
