
import { useToast } from '@/hooks/use-toast';
import { TripFormData } from '@/hooks/useTripForm';
import { TripWizardStep } from '@/hooks/useTripWizard';
import { useLanguage } from '@/contexts/LanguageContext';
import { TripValidators } from '@/validation';

export const useFormValidation = () => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const validateStep = (step: TripWizardStep, formData: TripFormData): boolean => {
    const result = TripValidators.validateStep(step, formData);
    return result.isValid;
  };

  const showValidationError = (step: TripWizardStep, formData: TripFormData) => {
    const result = TripValidators.validateStep(step, formData);
    
    if (!result.isValid && result.errorMessage) {
      toast({
        title: t.incompleteStep,
        description: result.errorMessage,
        variant: "destructive",
      });
    }
  };

  return {
    validateStep,
    showValidationError
  };
};
