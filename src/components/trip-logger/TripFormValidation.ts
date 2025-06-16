
import { TripFormData } from '@/hooks/useTripForm';

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export const validateTripForm = (formData: TripFormData): ValidationResult => {
  if (!formData.vanId || !formData.companyId || !formData.branchId || !formData.startKm) {
    return {
      isValid: false,
      errorMessage: "Please fill in all required fields including starting kilometers"
    };
  }

  const startKmValue = parseInt(formData.startKm);
  if (isNaN(startKmValue) || startKmValue < 0) {
    return {
      isValid: false,
      errorMessage: "Please enter a valid starting kilometer value"
    };
  }

  if (formData.selectedUsersWithRoles.length === 0) {
    return {
      isValid: false,
      errorMessage: "Please select at least one user with roles for the trip"
    };
  }

  return { isValid: true };
};
