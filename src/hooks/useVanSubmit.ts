
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
      // Check for duplicate reference code before submission
      if (formData.referenceCode.trim()) {
        console.log('🔍 Checking for duplicate reference code:', formData.referenceCode);
        
        // Build query to check for duplicates
        let query = supabase
          .from('vans')
          .select('id, reference_code')
          .eq('reference_code', formData.referenceCode.trim());
        
        // If editing an existing van, exclude it from the duplicate check
        if (van?.id) {
          query = query.neq('id', van.id);
        }

        const { data: existingVans, error: checkError } = await query;

        if (checkError) {
          console.error('❌ Error checking duplicate reference code:', checkError);
          toast({
            title: t.error || 'Error',
            description: 'Erreur lors de la vérification du code de référence',
            variant: "destructive",
          });
          return;
        }

        // Check if any duplicates were found
        if (existingVans && existingVans.length > 0) {
          console.error('❌ Duplicate reference code found:', existingVans[0]);
          toast({
            title: t.error || 'Error',
            description: `Le code de référence "${formData.referenceCode}" est déjà utilisé par une autre camionnette`,
            variant: "destructive",
          });
          return;
        }
        
        console.log('✅ No duplicate reference code found, proceeding with save');
      }

      // Prepare van data with all fields including new ones
      const vanData = {
        reference_code: formData.referenceCode.trim(),
        license_plate: formData.plateNumber.trim(),
        model: formData.model.trim(),
        status: formData.status,
        insurer: formData.insurer?.trim() || null,
        insurance_date: formData.insuranceDate?.toISOString().split('T')[0] || null,
        control_date: formData.controlDate?.toISOString().split('T')[0] || null,
        notes: formData.notes?.trim() || null,
        current_location: formData.currentLocation?.trim() || null,
        current_responsible_id: formData.currentResponsibleId || null,
        current_odometer_km: formData.currentOdometerKm || 0,
      };

      console.log('🚐 useVanSubmit: Prepared van data:', vanData);

      if (van?.id) {
        // Update existing van
        console.log('🚐 useVanSubmit: Updating existing van with ID:', van.id);
        
        const { data, error } = await supabase
          .from('vans')
          .update(vanData)
          .eq('id', van.id)
          .select()
          .single();

        if (error) {
          console.error('❌ Error updating van - Full error object:', error);
          console.error('❌ Error code:', error.code);
          console.error('❌ Error message:', error.message);
          console.error('❌ Error details:', error.details);
          console.error('❌ Error hint:', error.hint);
          
          toast({
            title: t.error || 'Error',
            description: `Impossible de modifier la camionnette: ${error.message || 'Erreur inconnue'}`,
            variant: "destructive",
          });
          return;
        }

        console.log('✅ Van updated successfully:', data);
        toast({
          title: t.success || 'Success',
          description: `La camionnette ${formData.referenceCode || formData.plateNumber} a été modifiée avec succès`,
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
          console.error('❌ Error creating van - Full error object:', error);
          console.error('❌ Error code:', error.code);
          console.error('❌ Error message:', error.message);
          console.error('❌ Error details:', error.details);
          console.error('❌ Error hint:', error.hint);
          
          toast({
            title: t.error || 'Error',
            description: `Impossible de créer la camionnette: ${error.message || 'Erreur inconnue'}`,
            variant: "destructive",
          });
          return;
        }

        console.log('✅ Van created successfully:', data);
        toast({
          title: t.success || 'Success',
          description: `La camionnette ${formData.referenceCode || formData.plateNumber} a été créée avec succès`,
        });
      }

      // Close modal and trigger refresh only on successful save
      onClose();
      onSaveSuccess?.();
    } catch (error) {
      console.error('❌ Error saving van - Catch block:', error);
      console.error('❌ Error type:', typeof error);
      console.error('❌ Error stringified:', JSON.stringify(error, null, 2));
      
      toast({
        title: t.error || 'Error',
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
