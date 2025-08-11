
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit, MapPin, User, Gauge, Calendar, Shield, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { Van } from '@/types/van';
import { useUsers } from '@/hooks/useUsers';

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
  onEdit
}) => {
  const { users } = useUsers();

  if (!van) return null;

  const responsible = users.find(user => user.id === van.current_responsible_id);
  
  const handleEditClick = () => {
    console.log('🚐 VanDetailsDialog: Edit clicked, passing van:', van);
    onEdit(van);
    onClose(); // Close the details dialog when opening edit
  };

  const isInsuranceExpired = van.insurance_date && new Date(van.insurance_date) < new Date();
  const isControlExpired = van.control_date && new Date(van.control_date) < new Date();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Détails du véhicule
            </DialogTitle>
            <Button
              onClick={handleEditClick}
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
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Code de référence</label>
              <p className="text-lg font-semibold">{van.reference_code}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Plaque d'immatriculation</label>
              <p className="text-lg font-semibold">{van.license_plate || 'Non renseignée'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Modèle</label>
              <p className="text-lg">{van.model}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Statut</label>
              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                van.status === 'Active' ? 'bg-green-100 text-green-800' :
                van.status === 'En Transit' ? 'bg-blue-100 text-blue-800' :
                van.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {van.status}
              </span>
            </div>
          </div>

          {/* Location and Responsible */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-blue-500 mt-1" />
              <div>
                <label className="text-sm font-medium text-gray-600">Localisation actuelle</label>
                <p className="text-base">{van.current_location || 'Non renseignée'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-green-500 mt-1" />
              <div>
                <label className="text-sm font-medium text-gray-600">Responsable actuel</label>
                <p className="text-base">
                  {responsible ? `${responsible.name}${responsible.email ? ` (${responsible.email})` : ''}` : 'Non assigné'}
                </p>
              </div>
            </div>
          </div>

          {/* Odometer */}
          <div className="flex items-start gap-3">
            <Gauge className="h-5 w-5 text-purple-500 mt-1" />
            <div>
              <label className="text-sm font-medium text-gray-600">Kilométrage actuel</label>
              <p className="text-base">{van.current_odometer_km || 0} km</p>
            </div>
          </div>

          {/* Insurance and Control */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-500 mt-1" />
              <div>
                <label className="text-sm font-medium text-gray-600">Assurance</label>
                <p className="text-base">{van.insurer || 'Non renseignée'}</p>
                {van.insurance_date && (
                  <p className={`text-sm ${isInsuranceExpired ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                    {isInsuranceExpired ? '⚠️ Expirée le ' : 'Expire le '}
                    {format(new Date(van.insurance_date), 'dd/MM/yyyy')}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-orange-500 mt-1" />
              <div>
                <label className="text-sm font-medium text-gray-600">Contrôle technique</label>
                {van.control_date ? (
                  <p className={`text-sm ${isControlExpired ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                    {isControlExpired ? '⚠️ Expiré le ' : 'Expire le '}
                    {format(new Date(van.control_date), 'dd/MM/yyyy')}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">Non renseignée</p>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          {van.notes && (
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-gray-500 mt-1" />
              <div>
                <label className="text-sm font-medium text-gray-600">Notes</label>
                <p className="text-base whitespace-pre-wrap">{van.notes}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VanDetailsDialog;
