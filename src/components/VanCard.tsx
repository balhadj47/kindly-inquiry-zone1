
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
  Fuel,
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
    <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500 bg-gradient-to-r from-white to-gray-50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          {/* Left side - Van info */}
          <div className="flex items-start space-x-4 flex-1">
            <div className="bg-blue-500 p-3 rounded-xl shadow-md">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{van.model}</h3>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="font-medium">{van.license_plate}</span>
              </div>
              {van.reference_code && (
                <div className="flex items-center text-sm text-gray-500">
                  <FileText className="h-3 w-3 mr-1" />
                  <span>Réf: {van.reference_code}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Status and actions */}
          <div className="flex flex-col items-end space-y-3">
            {van.status && (
              <Badge className={`${getStatusColor(van.status)} font-medium px-3 py-1`}>
                {van.status}
              </Badge>
            )}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => { e.stopPropagation(); handleEdit(); }}
                className="hover:bg-blue-50 hover:border-blue-300"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => { e.stopPropagation(); onDelete(van); }}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom section - Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          {van.insurer && (
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Assureur</p>
                <p className="text-sm font-medium text-gray-700">{van.insurer}</p>
              </div>
            </div>
          )}
          
          {van.insurance_date && (
            <div className="flex items-center space-x-2">
              <Calendar className={`h-4 w-4 ${isInsuranceExpired ? 'text-red-500' : 'text-green-500'}`} />
              <div>
                <p className="text-xs text-gray-500">Assurance</p>
                <p className={`text-sm font-medium ${isInsuranceExpired ? 'text-red-700' : 'text-gray-700'}`}>
                  {format(new Date(van.insurance_date), 'dd/MM/yyyy')}
                  {isInsuranceExpired && <span className="text-red-600 ml-1">(Exp.)</span>}
                </p>
              </div>
            </div>
          )}
          
          {van.control_date && (
            <div className="flex items-center space-x-2">
              <Calendar className={`h-4 w-4 ${isControlExpired ? 'text-red-500' : 'text-green-500'}`} />
              <div>
                <p className="text-xs text-gray-500">Contrôle</p>
                <p className={`text-sm font-medium ${isControlExpired ? 'text-red-700' : 'text-gray-700'}`}>
                  {format(new Date(van.control_date), 'dd/MM/yyyy')}
                  {isControlExpired && <span className="text-red-600 ml-1">(Exp.)</span>}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Notes section */}
        {van.notes && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
            <div className="flex items-start space-x-2">
              <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Notes</p>
                <p className="text-sm text-gray-700">
                  {van.notes.length > 100 ? `${van.notes.slice(0, 100)}...` : van.notes}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

VanCard.displayName = 'VanCard';

export default VanCard;
