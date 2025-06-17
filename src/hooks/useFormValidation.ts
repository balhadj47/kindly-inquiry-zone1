
import { useToast } from '@/hooks/use-toast';
import { TripFormData } from '@/hooks/useTripForm';
import { TripWizardStep } from '@/hooks/useTripWizard';

export const useFormValidation = () => {
  const { toast } = useToast();

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
        errorMessage = 'Veuillez sélectionner un véhicule et entrer le kilométrage de départ';
        break;
      case 'company':
        errorMessage = 'Veuillez sélectionner une entreprise et une succursale';
        break;
      case 'team':
        errorMessage = 'Veuillez sélectionner au moins un utilisateur avec des rôles';
        break;
      case 'details':
        errorMessage = 'La date de début doit être antérieure à la date de fin';
        break;
    }
    toast({
      title: 'Étape incomplète',
      description: errorMessage,
      variant: "destructive",
    });
  };

  return {
    validateStep,
    showValidationError
  };
};
