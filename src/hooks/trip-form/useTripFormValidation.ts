
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { TripWizardStep } from '@/hooks/useTripWizard';
import { TripValidators } from '@/validation';
import { TripFormData } from '@/hooks/useTripForm';

export const useTripFormValidation = () => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const validateForm = useCallback((formData: TripFormData) => {
    const result = TripValidators.validateFullTrip(formData);
    
    if (!result.isValid) {
      toast({
        title: t.error,
        description: result.errorMessage || 'Erreur de validation',
        variant: "destructive",
      });
      return false;
    }

    return true;
  }, [toast, t]);

  const validateCurrentStep = useCallback((currentStep: TripWizardStep, formData: TripFormData) => {
    const result = TripValidators.validateStep(currentStep, formData);
    
    if (!result.isValid) {
      toast({
        title: t.error,
        description: result.errorMessage || 'Erreur de validation',
        variant: "destructive",
      });
      return false;
    }

    return true;
  }, [toast, t]);

  return {
    validateForm,
    validateCurrentStep,
  };
};
