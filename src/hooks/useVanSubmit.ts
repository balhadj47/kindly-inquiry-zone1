
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
    console.log('🚐 useVanSubmit: Starting submission with data:', formData);
    console.log('🚐 useVanSubmit: Van being edited:', van);
    
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

      console.log('🚐 useVanSubmit: Prepared van data:', vanData);

      if (van && van.id) {
        // Update existing van
        console.log('🚐 useVanSubmit: Updating existing van with ID:', van.id);
        
        const { data, error } = await supabase
          .from('vans')
          .update(vanData)
          .eq('id', van.id)
          .select()
          .single();

        if (error) {
          console.error('❌ Error updating van:', error);
          toast({
            title: t.error,
            description: `Impossible de modifier la camionnette: ${error.message}`,
            variant: "destructive",
          });
          return;
        }

        console.log('✅ Van updated successfully:', data);
        toast({
          title: t.success,
          description: `La camionnette ${formData.plateNumber || formData.referenceCode} a été modifiée avec succès`,
        });
      } else {
        // Create new van
        console.log('🚐 useVanSubmit: Creating new van');
        
        const { data, error } = await supabase
          .from('vans')
          .insert([vanData])
          .select()
          .single();

        if (error) {
          console.error('❌ Error creating van:', error);
          toast({
            title: t.error,
            description: `Impossible de créer la camionnette: ${error.message}`,
            variant: "destructive",
          });
          return;
        }

        console.log('✅ Van created successfully:', data);
        toast({
          title: t.success,
          description: `La camionnette ${formData.plateNumber || formData.referenceCode} a été créée avec succès`,
        });
      }

      // Close modal and trigger refresh only on successful save
      onClose();
      onSaveSuccess?.();
    } catch (error) {
      console.error('❌ Error saving van:', error);
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
