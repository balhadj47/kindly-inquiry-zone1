
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Trash2,
  Shield,
  Calendar,
  FileText,
  Car,
  MapPin
} from 'lucide-react';
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
  const handleDelete = React.useCallback(() => onDelete(van), [onDelete, van]);

  // Check if dates are expired
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const insuranceDate = van.insurance_date ? new Date(van.insurance_date) : null;
  const controlDate = van.control_date ? new Date(van.control_date) : null;
  
  const isInsuranceExpired = insuranceDate && insuranceDate < today;
  const isControlExpired = controlDate && controlDate < today;

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
      <CardContent className="p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="bg-blue-500 p-2 rounded-lg flex-shrink-0">
              <Car className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-gray-900 text-sm truncate">{van.model}</h3>
              <div className="flex items-center text-xs text-gray-600">
                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{van.license_plate}</span>
              </div>
            </div>
          </div>
          
          {van.status && (
            <Badge className={`${getStatusColor(van.status)} text-xs flex-shrink-0`}>
              {van.status}
            </Badge>
          )}
        </div>

        {/* Reference Code */}
        {van.reference_code && (
          <div className="flex items-center text-xs text-gray-500 mb-3">
            <FileText className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="truncate">Réf: {van.reference_code}</span>
          </div>
        )}

        {/* Details Grid */}
        <div className="flex-1 space-y-2 mb-3">
          {van.insurer && (
            <div className="flex items-center space-x-2">
              <Shield className="h-3 w-3 text-blue-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Assureur</p>
                <p className="text-xs font-medium text-gray-700 truncate">{van.insurer}</p>
              </div>
            </div>
          )}
          
          {van.insurance_date && (
            <div className="flex items-center space-x-2">
              <Calendar className={`h-3 w-3 flex-shrink-0 ${isInsuranceExpired ? 'text-red-500' : 'text-green-500'}`} />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Assurance</p>
                <p className={`text-xs font-medium ${isInsuranceExpired ? 'text-red-700' : 'text-gray-700'}`}>
                  {format(new Date(van.insurance_date), 'dd/MM/yyyy')}
                  {isInsuranceExpired && <span className="text-red-600 ml-1">(Exp.)</span>}
                </p>
              </div>
            </div>
          )}
          
          {van.control_date && (
            <div className="flex items-center space-x-2">
              <Calendar className={`h-3 w-3 flex-shrink-0 ${isControlExpired ? 'text-red-500' : 'text-green-500'}`} />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Contrôle</p>
                <p className={`text-xs font-medium ${isControlExpired ? 'text-red-700' : 'text-gray-700'}`}>
                  {format(new Date(van.control_date), 'dd/MM/yyyy')}
                  {isControlExpired && <span className="text-red-600 ml-1">(Exp.)</span>}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        {van.notes && (
          <div className="mb-3 p-2 bg-gray-50 rounded text-xs">
            <div className="flex items-start space-x-1">
              <FileText className="h-3 w-3 text-gray-500 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-gray-500 mb-1">Notes</p>
                <p className="text-gray-700 line-clamp-2">
                  {van.notes.length > 60 ? `${van.notes.slice(0, 60)}...` : van.notes}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2 mt-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => { e.stopPropagation(); handleEdit(); }}
            className="flex-1 text-xs h-8"
          >
            <Edit className="h-3 w-3 mr-1" />
            Modifier
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onDelete(van); }}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs h-8"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

VanCard.displayName = 'VanCard';

export default VanCard;
