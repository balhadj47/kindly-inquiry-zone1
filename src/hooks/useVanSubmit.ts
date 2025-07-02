
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { VanFormData } from './useVanForm';
import { useLanguage } from '@/contexts/LanguageContext';

export const useVanSubmit = (van: any, onClose: () => void, onSaveSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (formData: VanFormData) => {
    setIsSubmitting(true);

    try {
      // Prepare van data with all fields including new ones
      const vanData = {
        reference_code: formData.referenceCode,
        license_plate: formData.plateNumber,
        model: formData.model,
        status: formData.status,
        insurer: formData.insurer,
        insurance_date: formData.insuranceDate?.toISOString().split('T')[0] || null,
        control_date: formData.controlDate?.toISOString().split('T')[0] || null,
        notes: formData.notes,
        current_location: formData.currentLocation,
        current_responsible_id: formData.currentResponsibleId,
        current_odometer_km: formData.currentOdometerKm,
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
            title: t.error,
            description: "Impossible de modifier la camionnette",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: t.success,
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
            title: t.error,
            description: "Impossible de créer la camionnette",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: t.success,
          description: `La camionnette ${formData.plateNumber} a été créée avec succès`,
        });
      }

      // Close modal and trigger refresh only on successful save
      onClose();
      onSaveSuccess?.();
    } catch (error) {
      console.error('Error saving van:', error);
      toast({
        title: t.error,
        description: "Une erreur s'est produite lors de la sauvegarde",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit,
  };
};
