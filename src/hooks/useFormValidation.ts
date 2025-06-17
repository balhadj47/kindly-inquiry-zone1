
import { useToast } from '@/hooks/use-toast';
import { TripFormData } from '@/hooks/useTripForm';
import { TripWizardStep } from '@/hooks/useTripWizard';
import { useLanguage } from '@/contexts/LanguageContext';

export const useFormValidation = () => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const validateStep = (step: TripWizardStep, formData: TripFormData): boolean => {
    switch (step) {
      case 'van':
        return !!(formData.vanId && formData.startKm && parseInt(formData.startKm) >= 0);
      case 'company':
        return !!(formData.companyId && formData.branchId);
      case 'team':
        return formData.selectedUsersWithRoles.length > 0;
      case 'details':
        // Validate that start date is before end date if both are provided
        if (formData.startDate && formData.endDate) {
          return formData.startDate <= formData.endDate;
        }
        return true; // Notes and dates are optional
      default:
        return false;
    }
  };

  const showValidationError = (step: TripWizardStep) => {
    let errorMessage = '';
    switch (step) {
      case 'van':
        errorMessage = t.selectVehicleAndKm;
        break;
      case 'company':
        errorMessage = t.selectCompanyAndBranch;
        break;
      case 'team':
        errorMessage = t.selectAtLeastOneUser;
        break;
      case 'details':
        errorMessage = t.startDateMustBeBeforeEnd;
        break;
    }
    toast({
      title: t.incompleteStep,
      description: errorMessage,
      variant: "destructive",
    });
  };

  return {
    validateStep,
    showValidationError
  };
};
