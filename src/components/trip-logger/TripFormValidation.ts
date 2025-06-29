
import { TripFormData } from '@/hooks/useTripForm';
import { TripBusinessLogic } from '@/services/tripBusinessLogic';
import { UserBusinessLogic } from '@/services/userBusinessLogic';
import { VanBusinessLogic } from '@/services/vanBusinessLogic';

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export const validateTripForm = (formData: TripFormData): ValidationResult => {
  // Basic required fields validation
  if (!formData.vanId || !formData.companyId || !formData.branchId || !formData.startKm) {
    return {
      isValid: false,
      errorMessage: "Please fill in all required fields including starting kilometers"
    };
  }

  // Use business logic for kilometer validation
  const startKmValue = parseInt(formData.startKm);
  if (isNaN(startKmValue) || startKmValue < 0) {
    return {
      isValid: false,
      errorMessage: "Please enter a valid starting kilometer value"
    };
  }

  // Validate user selection
  if (formData.selectedUsersWithRoles.length === 0) {
    return {
      isValid: false,
      errorMessage: "Please select at least one user with roles for the trip"
    };
  }

  // Validate selected users are available
  for (const userRole of formData.selectedUsersWithRoles) {
    if (!UserBusinessLogic.isUserAvailableForTrip(userRole.user)) {
      return {
        isValid: false,
        errorMessage: `User ${userRole.user.name} is not available for trips`
      };
    }
  }

  // Validate date logic if both dates are provided
  if (formData.startDate && formData.endDate) {
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    if (startDate >= endDate) {
      return {
        isValid: false,
        errorMessage: "End date must be after start date"
      };
    }
  }

  return { isValid: true };
};

export const validateTripStep = (step: string, formData: TripFormData): ValidationResult => {
  switch (step) {
    case 'van':
      if (!formData.vanId) {
        return { isValid: false, errorMessage: "Please select a van" };
      }
      if (!formData.startKm || parseInt(formData.startKm) < 0) {
        return { isValid: false, errorMessage: "Please enter valid starting kilometers" };
      }
      return { isValid: true };
      
    case 'company':
      if (!formData.companyId || !formData.branchId) {
        return { isValid: false, errorMessage: "Please select company and branch" };
      }
      return { isValid: true };
      
    case 'team':
      if (formData.selectedUsersWithRoles.length === 0) {
        return { isValid: false, errorMessage: "Please select at least one team member" };
      }
      return { isValid: true };
      
    case 'details':
      // Optional step validation
      return { isValid: true };
      
    default:
      return { isValid: false, errorMessage: "Unknown step" };
  }
};
