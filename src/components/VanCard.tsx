
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
    <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white">
      <CardContent className="p-6">
        {/* Header with improved spacing */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-sm">
              <Car className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{van.model}</h3>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0 text-gray-400" />
                <span className="truncate font-medium">{van.license_plate}</span>
              </div>
            </div>
          </div>
          
          {van.status && (
            <Badge className={`${getStatusColor(van.status)} text-xs font-medium px-2 py-1`}>
              {van.status}
            </Badge>
          )}
        </div>

        {/* Reference Code */}
        {van.reference_code && (
          <div className="flex items-center text-sm text-gray-500 mb-4 bg-gray-50 rounded-lg p-2">
            <FileText className="h-4 w-4 mr-2 text-gray-400" />
            <span className="font-medium">Réf: {van.reference_code}</span>
          </div>
        )}

        {/* Details */}
        <div className="space-y-3 mb-4">
          {van.insurer && (
            <div className="flex items-center space-x-3">
              <Shield className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium">Assureur</p>
                <p className="text-sm font-semibold text-gray-800 truncate">{van.insurer}</p>
              </div>
            </div>
          )}
          
          {van.insurance_date && (
            <div className="flex items-center space-x-3">
              <Calendar className={`h-4 w-4 flex-shrink-0 ${isInsuranceExpired ? 'text-red-500' : 'text-green-500'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium">Assurance</p>
                <p className={`text-sm font-semibold ${isInsuranceExpired ? 'text-red-700' : 'text-gray-800'}`}>
                  {format(new Date(van.insurance_date), 'dd/MM/yyyy')}
                  {isInsuranceExpired && <span className="text-red-600 ml-1 text-xs">(Exp.)</span>}
                </p>
              </div>
            </div>
          )}
          
          {van.control_date && (
            <div className="flex items-center space-x-3">
              <Calendar className={`h-4 w-4 flex-shrink-0 ${isControlExpired ? 'text-red-500' : 'text-green-500'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium">Contrôle</p>
                <p className={`text-sm font-semibold ${isControlExpired ? 'text-red-700' : 'text-gray-800'}`}>
                  {format(new Date(van.control_date), 'dd/MM/yyyy')}
                  {isControlExpired && <span className="text-red-600 ml-1 text-xs">(Exp.)</span>}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        {van.notes && (
          <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div className="flex items-start space-x-2">
              <FileText className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-blue-600 font-medium mb-1">Notes</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {van.notes.length > 80 ? `${van.notes.slice(0, 80)}...` : van.notes}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => { e.stopPropagation(); handleEdit(); }}
            className="flex-1 h-9 font-medium hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onDelete(van); }}
            className="h-9 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

VanCard.displayName = 'VanCard';

export default VanCard;
