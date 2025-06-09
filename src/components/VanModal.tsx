
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const VanModal = ({ isOpen, onClose, van }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    plateNumber: '',
    carNumberPlate: '',
    model: '',
    status: 'Active',
    insuranceDate: null,
    controlDate: null,
    insurer: '',
    notes: '',
  });

  useEffect(() => {
    if (van) {
      setFormData({
        plateNumber: van.license_plate || van.plateNumber || '',
        carNumberPlate: van.carNumberPlate || '',
        model: van.model || '',
        status: van.status || 'Active',
        insuranceDate: van.insuranceDate ? new Date(van.insuranceDate) : null,
        controlDate: van.controlDate ? new Date(van.controlDate) : null,
        insurer: van.insurer || '',
        notes: van.notes || '',
      });
    } else {
      setFormData({
        plateNumber: '',
        carNumberPlate: '',
        model: '',
        status: 'Active',
        insuranceDate: null,
        controlDate: null,
        insurer: '',
        notes: '',
      });
    }
  }, [van]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const vanData = {
        license_plate: formData.plateNumber,
        model: formData.model,
        driver_id: null, // Set to null for now, can be assigned later
        // Note: Additional fields like carNumberPlate, insuranceDate, etc. would need
        // corresponding columns in the database table to be stored
      };

      if (van) {
        // Update existing van
        const { error } = await supabase
          .from('vans')
          .update(vanData)
          .eq('id', van.id);

        if (error) {
          console.error('Error updating van:', error);
          toast({
            title: "Erreur",
            description: "Impossible de modifier la camionnette",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Succès",
          description: `La camionnette ${formData.plateNumber} a été modifiée avec succès`,
        });
      } else {
        // Create new van
        const { error } = await supabase
          .from('vans')
          .insert([vanData]);

        if (error) {
          console.error('Error creating van:', error);
          toast({
            title: "Erreur",
            description: "Impossible de créer la camionnette",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Succès",
          description: `La camionnette ${formData.plateNumber} a été créée avec succès`,
        });
      }

      onClose();
      // The parent component should refresh the vans list
      window.location.reload(); // Simple refresh for now
    } catch (error) {
      console.error('Error saving van:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la sauvegarde",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (field, date) => {
    setFormData(prev => ({ ...prev, [field]: date }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {van ? t.editVan : t.addNewVan}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plate-number" className="text-sm sm:text-base">{t.plateNumber}</Label>
              <Input
                id="plate-number"
                value={formData.plateNumber}
                onChange={(e) => handleInputChange('plateNumber', e.target.value)}
                placeholder="e.g., VAN-001"
                className="text-base touch-manipulation"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="car-number-plate" className="text-sm sm:text-base">{t.carNumberPlate}</Label>
              <Input
                id="car-number-plate"
                value={formData.carNumberPlate}
                onChange={(e) => handleInputChange('carNumberPlate', e.target.value)}
                placeholder="e.g., ABC-123"
                className="text-base touch-manipulation"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="model" className="text-sm sm:text-base">{t.vanModel}</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                placeholder="e.g., Ford Transit"
                className="text-base touch-manipulation"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm sm:text-base">{t.status}</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger className="text-base touch-manipulation">
                  <SelectValue placeholder={t.selectStatus} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">{t.vanStatuses?.active || 'Active'}</SelectItem>
                  <SelectItem value="In Transit">{t.vanStatuses?.inTransit || 'In Transit'}</SelectItem>
                  <SelectItem value="Maintenance">{t.vanStatuses?.maintenance || 'Maintenance'}</SelectItem>
                  <SelectItem value="Inactive">{t.vanStatuses?.inactive || 'Inactive'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="insurer" className="text-sm sm:text-base">{t.insurer}</Label>
            <Input
              id="insurer"
              value={formData.insurer}
              onChange={(e) => handleInputChange('insurer', e.target.value)}
              placeholder="e.g., AXA Insurance"
              className="text-base touch-manipulation"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm sm:text-base">{t.insuranceDate}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal text-base touch-manipulation",
                      !formData.insuranceDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.insuranceDate ? format(formData.insuranceDate, "PPP") : <span>{t.pickInsuranceDate}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.insuranceDate}
                    onSelect={(date) => handleDateChange('insuranceDate', date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm sm:text-base">{t.controlDate}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal text-base touch-manipulation",
                      !formData.controlDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.controlDate ? format(formData.controlDate, "PPP") : <span>{t.pickControlDate}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.controlDate}
                    onSelect={(date) => handleDateChange('controlDate', date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm sm:text-base">{t.notes}</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder={t.additionalNotes}
              className="text-base touch-manipulation min-h-[100px]"
              rows={4}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="order-2 sm:order-1 touch-manipulation"
              size="lg"
              disabled={isSubmitting}
            >
              {t.cancel}
            </Button>
            <Button 
              type="submit"
              className="order-1 sm:order-2 touch-manipulation"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enregistrement...' : (van ? t.updateVan : t.createVan)}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VanModal;
