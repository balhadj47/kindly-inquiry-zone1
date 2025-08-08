import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useVanForm } from '@/hooks/useVanForm';
import { useVanMutations } from '@/hooks/useVansOptimized';
import { format } from 'date-fns';
import { DatePicker } from "@/components/ui/date-picker"
import { Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VanDetailsDialogProps {
  van: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (vanId: string) => void;
  onDelete?: (vanId: string) => void;
}

const VanDetailsDialog = ({ van, isOpen, onClose, onUpdate, onDelete }: VanDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { formData, handleInputChange, handleDateChange } = useVanForm(van);
  const { updateVan, deleteVan } = useVanMutations();
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const updateData = {
        id: van.id,
        reference_code: formData.referenceCode,
        license_plate: formData.plateNumber,
        model: formData.model,
        status: formData.status,
        insurer: formData.insurer,
        insurance_date: formData.insuranceDate?.toISOString().split('T')[0],
        control_date: formData.controlDate?.toISOString().split('T')[0],
        notes: formData.notes,
        current_location: formData.currentLocation,
        current_responsible_id: formData.currentResponsibleId,
        current_odometer_km: formData.currentOdometerKm,
      };

      await updateVan.mutateAsync(updateData);
      setIsEditing(false);
      onUpdate?.(van.id);
    } catch (error) {
      console.error('Error updating van:', error);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteVan.mutateAsync(van.id);
      onDelete?.(van.id);
      onClose();
      toast({
        title: 'Succès',
        description: 'Camionnette supprimée avec succès',
      });
    } catch (error) {
      console.error('Error deleting van:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la suppression de la camionnette',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Fixed comparison to handle both string and number types
  const isCurrentUserResponsible = van.current_responsible_id?.toString() === '1' || van.current_responsible_id === 1;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? `Modifier ${van.license_plate}` : `Détails du véhicule ${van.license_plate}`}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Modifiez les informations du véhicule.' : 'Consultez les informations détaillées du véhicule.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="referenceCode" className="text-sm font-medium text-gray-700">
                Code de référence
              </Label>
              {isEditing ? (
                <Input
                  id="referenceCode"
                  value={formData.referenceCode}
                  onChange={(e) => handleInputChange('referenceCode', e.target.value)}
                  placeholder="Entrez le code de référence"
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{van.reference_code || 'Non spécifié'}</p>
              )}
            </div>

            <div>
              <Label htmlFor="plateNumber" className="text-sm font-medium text-gray-700">
                Numéro de plaque
              </Label>
              {isEditing ? (
                <Input
                  id="plateNumber"
                  value={formData.plateNumber}
                  onChange={(e) => handleInputChange('plateNumber', e.target.value)}
                  placeholder="Entrez le numéro de plaque"
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{van.license_plate || 'Non spécifié'}</p>
              )}
            </div>

            <div>
              <Label htmlFor="model" className="text-sm font-medium text-gray-700">
                Modèle
              </Label>
              {isEditing ? (
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  placeholder="Entrez le modèle"
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{van.model || 'Non spécifié'}</p>
              )}
            </div>

            <div>
              <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                Statut
              </Label>
              {isEditing ? (
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              ) : (
                <p className="mt-1 text-sm text-gray-900">{van.status || 'Non spécifié'}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="currentLocation" className="text-sm font-medium text-gray-700">
                Lieu actuel
              </Label>
              {isEditing ? (
                <Input
                  id="currentLocation"
                  value={formData.currentLocation}
                  onChange={(e) => handleInputChange('currentLocation', e.target.value)}
                  placeholder="Entrez le lieu actuel"
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{van.current_location || 'Non spécifié'}</p>
              )}
            </div>

            <div>
              <Label htmlFor="currentOdometerKm" className="text-sm font-medium text-gray-700">
                Kilométrage actuel
              </Label>
              {isEditing ? (
                <Input
                  id="currentOdometerKm"
                  type="number"
                  value={formData.currentOdometerKm}
                  onChange={(e) => handleInputChange('currentOdometerKm', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">
                  {van.current_odometer_km ? `${van.current_odometer_km} km` : 'Non spécifié'}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="insurer" className="text-sm font-medium text-gray-700">
                Assureur
              </Label>
              {isEditing ? (
                <Input
                  id="insurer"
                  value={formData.insurer}
                  onChange={(e) => handleInputChange('insurer', e.target.value)}
                  placeholder="Nom de l'assureur"
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{van.insurer || 'Non spécifié'}</p>
              )}
            </div>

            <div>
              <Label htmlFor="insurance_date" className="text-sm font-medium text-gray-700">
                Date d'assurance
              </Label>
              {isEditing ? (
                <DatePicker
                  id="insurance_date"
                  onSelect={(date) => handleDateChange('insuranceDate', date)}
                  defaultMonth={formData.insuranceDate}
                  mode="single"
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">
                  {van.insurance_date ? format(new Date(van.insurance_date), 'dd/MM/yyyy') : 'Non spécifiée'}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="control_date" className="text-sm font-medium text-gray-700">
                Date de contrôle technique
              </Label>
              {isEditing ? (
                <DatePicker
                  id="control_date"
                  onSelect={(date) => handleDateChange('controlDate', date)}
                  defaultMonth={formData.controlDate}
                  mode="single"
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">
                  {van.control_date ? format(new Date(van.control_date), 'dd/MM/yyyy') : 'Non spécifiée'}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                Notes
              </Label>
              {isEditing ? (
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Ajouter des notes"
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{van.notes || 'Aucune note'}</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          {isEditing ? (
            <div className="space-x-2">
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
                Annuler
              </Button>
              <Button onClick={handleSave}>Enregistrer</Button>
            </div>
          ) : (
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Modifier
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>Suppression...</>
                ) : (
                  <>
                    <Trash className="w-4 h-4 mr-2" />
                    Supprimer
                  </>
                )}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VanDetailsDialog;
