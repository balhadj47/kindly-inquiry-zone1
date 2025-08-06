
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { validateTripForm } from '@/components/trip-logger/TripFormValidation';
import { useFormValidation } from '@/hooks/useFormValidation';
import { TripWizardStep } from '@/hooks/useTripWizard';

export const useTripFormValidation = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { validateStep, showValidationError } = useFormValidation();

  const validateForm = useCallback((formData: any) => {
    const validation = validateTripForm(formData);
    if (!validation.isValid) {
      toast({
        title: t.error,
        description: validation.errorMessage,
        variant: "destructive",
      });
    }
    return validation;
  }, [toast, t]);

  const validateCurrentStep = useCallback((currentStep: TripWizardStep, formData: any) => {
    if (validateStep(currentStep, formData)) {
      return true;
    } else {
      showValidationError(currentStep);
      return false;
    }
  }, [validateStep, showValidationError]);

  return {
    validateForm,
    validateCurrentStep,
  };
};
