
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Car,
  MapPin,
  Shield,
  Calendar,
  FileText
} from 'lucide-react';
import { Van } from '@/types/van';
import { getStatusColor } from '@/utils/vanUtils';
import { format } from 'date-fns';

interface VanDetailsDialogProps {
  van: Van | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (van: Van) => void;
}

const VanDetailsDialog = ({ van, isOpen, onClose, onEdit }: VanDetailsDialogProps) => {
  if (!van) return null;

  // Check if dates are expired
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const insuranceDate = van.insurance_date ? new Date(van.insurance_date) : null;
  const controlDate = van.control_date ? new Date(van.control_date) : null;
  
  const isInsuranceExpired = insuranceDate && insuranceDate < today;
  const isControlExpired = controlDate && controlDate < today;

  const handleEdit = () => {
    if (onEdit) {
      onEdit(van);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
                <Car className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">{van.model}</span>
            </div>
            {van.status && (
              <Badge className={`${getStatusColor(van.status)} text-xs font-medium px-2 py-1`}>
                {van.status}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations de base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <div>
                    <label className="text-sm font-medium text-gray-500">Plaque d'immatriculation</label>
                    <p className="text-lg font-semibold text-gray-800">{van.license_plate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Car className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <div>
                    <label className="text-sm font-medium text-gray-500">Modèle</label>
                    <p className="text-lg font-semibold text-gray-800">{van.model}</p>
                  </div>
                </div>
                {van.reference_code && (
                  <div className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Code de référence</label>
                      <p className="text-lg font-semibold text-gray-800">{van.reference_code}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <div className="h-4 w-4 flex-shrink-0" />
                  <div>
                    <label className="text-sm font-medium text-gray-500">Statut</label>
                    <p className="text-lg font-semibold text-gray-800">{van.status}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insurance Information */}
          {(van.insurer || van.insurance_date || van.control_date) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations d'assurance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {van.insurer && (
                  <div className="flex items-center space-x-3">
                    <Shield className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Assureur</label>
                      <p className="text-lg font-semibold text-gray-800">{van.insurer}</p>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {van.insurance_date && (
                    <div className="flex items-center space-x-3">
                      <Calendar className={`h-4 w-4 flex-shrink-0 ${isInsuranceExpired ? 'text-red-500' : 'text-green-500'}`} />
                      <div>
                        <label className="text-sm font-medium text-gray-500">Date d'assurance</label>
                        <p className={`text-lg font-semibold ${isInsuranceExpired ? 'text-red-700' : 'text-gray-800'}`}>
                          {format(new Date(van.insurance_date), 'dd/MM/yyyy')}
                          {isInsuranceExpired && <span className="text-red-600 ml-2 text-sm">(Expirée)</span>}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {van.control_date && (
                    <div className="flex items-center space-x-3">
                      <Calendar className={`h-4 w-4 flex-shrink-0 ${isControlExpired ? 'text-red-500' : 'text-green-500'}`} />
                      <div>
                        <label className="text-sm font-medium text-gray-500">Date de contrôle</label>
                        <p className={`text-lg font-semibold ${isControlExpired ? 'text-red-700' : 'text-gray-800'}`}>
                          {format(new Date(van.control_date), 'dd/MM/yyyy')}
                          {isControlExpired && <span className="text-red-600 ml-2 text-sm">(Expirée)</span>}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {van.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                  <p className="text-gray-700 leading-relaxed">{van.notes}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            {onEdit && (
              <Button onClick={handleEdit} className="flex items-center space-x-2">
                <Edit className="h-4 w-4" />
                <span>Modifier</span>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VanDetailsDialog;
