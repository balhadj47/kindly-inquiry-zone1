
import { UserWithRoles } from './useTripForm';
import { TripValidators } from '@/validation';

export interface TripFormValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const useTripFormValidation = () => {
  const validateTeamSelection = (selectedUsersWithRoles: UserWithRoles[]): TripFormValidation => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Use centralized validation
    const basicValidation = TripValidators.validateTeamRoles(selectedUsersWithRoles);
    
    if (!basicValidation.isValid && basicValidation.errorMessage) {
      errors.push(basicValidation.errorMessage);
    }

    // Additional business rule warnings
    if (selectedUsersWithRoles.length === 1) {
      warnings.push('Mission avec un seul employé - considérez d\'ajouter plus de personnel');
    }

    const totalChauffeurs = selectedUsersWithRoles.filter(u => u.roles.includes('Chauffeur')).length;
    if (totalChauffeurs > 1) {
      warnings.push('Multiple chauffeurs assignés - vérifiez si c\'est nécessaire');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  };

  return {
    validateTeamSelection
  };
};
