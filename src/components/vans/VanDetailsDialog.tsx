
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Van } from '@/types/van';
import { Edit, Calendar, User, MapPin, Fuel, Gauge } from 'lucide-react';

interface VanDetailsDialogProps {
  van: Van | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (van: Van) => void;
}

const VanDetailsDialog: React.FC<VanDetailsDialogProps> = ({
  van,
  isOpen,
  onClose,
  onEdit,
}) => {
  // Early return if van is null
  if (!van) {
    return null;
  }

  const handleEdit = () => {
    onEdit(van);
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'actif':
        return 'bg-green-100 text-green-800';
      case 'inactive':
      case 'inactif':
        return 'bg-gray-100 text-gray-800';
      case 'en transit':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Détails du véhicule
            </DialogTitle>
            <Button
              onClick={handleEdit}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Modifier
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {van.license_plate}
              </h2>
              <p className="text-lg text-gray-600 mt-1">
                {van.model}
              </p>
            </div>
            <Badge className={getStatusColor(van.status)}>
              {van.status}
            </Badge>
          </div>

          <Separator />

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Informations générales
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Code de référence
                    </p>
                    <p className="text-gray-900">
                      {van.reference_code || 'N/A'}
                    </p>
                  </div>
                </div>

                {van.insurer && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Assureur
                      </p>
                      <p className="text-gray-900">{van.insurer}</p>
                    </div>
                  </div>
                )}

                {van.insurance_date && (
                  <div className="flex items-center gap-3">
                    <Fuel className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Date d'assurance
                      </p>
                      <p className="text-gray-900">{new Date(van.insurance_date).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Détails techniques
              </h3>
              
              <div className="space-y-3">
                {van.current_odometer_km && (
                  <div className="flex items-center gap-3">
                    <Gauge className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Kilométrage actuel
                      </p>
                      <p className="text-gray-900">
                        {van.current_odometer_km.toLocaleString()} km
                      </p>
                    </div>
                  </div>
                )}

                {van.current_responsible_id && (
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Responsable actuel
                      </p>
                      <p className="text-gray-900">
                        ID: {van.current_responsible_id}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {van.notes && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Notes
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {van.notes}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Timestamps */}
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
            <div>
              <p className="font-medium">Créé le:</p>
              <p>{new Date(van.created_at).toLocaleString('fr-FR')}</p>
            </div>
            <div>
              <p className="font-medium">Modifié le:</p>
              <p>{new Date(van.updated_at).toLocaleString('fr-FR')}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VanDetailsDialog;
