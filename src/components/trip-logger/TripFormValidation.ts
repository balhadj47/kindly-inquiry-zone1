
import { TripFormData } from '@/hooks/useTripForm';

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export const validateTripForm = (formData: TripFormData): ValidationResult => {
  // Basic required fields validation
  if (!formData.vanId || !formData.selectedCompanies?.length || !formData.startKm) {
    return {
      isValid: false,
      errorMessage: "Please fill in all required fields including starting kilometers and at least one company"
    };
  }

  // Validate that all selected companies have branches
  for (const company of formData.selectedCompanies) {
    if (!company.branchId) {
      return {
        isValid: false,
        errorMessage: `Please select a branch for ${company.companyName}`
      };
    }
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

  // Validate that each selected user has at least one role
  for (const userRole of formData.selectedUsersWithRoles) {
    if (!userRole.roles || userRole.roles.length === 0) {
      return {
        isValid: false,
        errorMessage: "Each selected user must have at least one role assigned"
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
      if (!formData.selectedCompanies?.length) {
        return { isValid: false, errorMessage: "Please select at least one company" };
      }
      // Validate that all selected companies have branches
      for (const company of formData.selectedCompanies) {
        if (!company.branchId) {
          return { isValid: false, errorMessage: `Please select a branch for ${company.companyName}` };
        }
      }
      return { isValid: true };
      
    case 'team':
      if (formData.selectedUsersWithRoles.length === 0) {
        return { isValid: false, errorMessage: "Please select at least one team member" };
      }
      // Validate that each user has roles assigned
      for (const userRole of formData.selectedUsersWithRoles) {
        if (!userRole.roles || userRole.roles.length === 0) {
          return { isValid: false, errorMessage: "Each selected team member must have at least one role assigned" };
        }
      }
      return { isValid: true };
      
    case 'details':
      // Optional step validation
      return { isValid: true };
      
    default:
      return { isValid: false, errorMessage: "Unknown step" };
  }
};
