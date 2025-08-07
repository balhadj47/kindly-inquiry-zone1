
import { UserWithRoles } from './useTripForm';

export interface TripFormValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const useTripFormValidation = () => {
  const validateTeamSelection = (selectedUsersWithRoles: UserWithRoles[]): TripFormValidation => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for required roles
    const hasChefDeGroupe = selectedUsersWithRoles.some(u => u.roles.includes('Chef de Groupe'));
    const hasChauffeur = selectedUsersWithRoles.some(u => u.roles.includes('Chauffeur'));

    if (!hasChefDeGroupe) {
      errors.push('Au moins un Chef de Groupe est requis pour la mission');
    }

    if (!hasChauffeur) {
      errors.push('Au moins un Chauffeur est requis pour la mission');
    }

    if (selectedUsersWithRoles.length === 0) {
      errors.push('Au moins un employé doit être assigné à la mission');
    }

    // Check for potential issues
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
