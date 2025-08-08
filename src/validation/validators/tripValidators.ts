
import { TripFormData } from '@/hooks/useTripForm';
import { TripWizardStep } from '@/hooks/useTripWizard';
import { 
  tripBasicSchema, 
  tripCompanySchema, 
  tripTeamSchema, 
  tripDetailsSchema,
  fullTripSchema 
} from '../schemas/tripValidation';

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export class TripValidators {
  static validateStep(step: TripWizardStep, formData: TripFormData): ValidationResult {
    try {
      switch (step) {
        case 'van':
          tripBasicSchema.parse({
            vanId: formData.vanId,
            startKm: formData.startKm,
            notes: formData.notes,
          });
          return { isValid: true };

        case 'company':
          tripCompanySchema.parse({
            selectedCompanies: formData.selectedCompanies,
          });
          return { isValid: true };

        case 'team':
          tripTeamSchema.parse({
            selectedUsersWithRoles: formData.selectedUsersWithRoles,
          });
          return { isValid: true };

        case 'details':
          tripDetailsSchema.parse({
            startDate: formData.startDate,
            endDate: formData.endDate,
          });
          return { isValid: true };

        default:
          return { isValid: false, errorMessage: 'Étape inconnue' };
      }
    } catch (error) {
      if (error instanceof Error) {
        return { isValid: false, errorMessage: error.message };
      }
      return { isValid: false, errorMessage: 'Erreur de validation' };
    }
  }

  static validateFullTrip(formData: TripFormData): ValidationResult {
    try {
      fullTripSchema.parse({
        vanId: formData.vanId,
        startKm: formData.startKm,
        notes: formData.notes,
        selectedCompanies: formData.selectedCompanies,
        selectedUsersWithRoles: formData.selectedUsersWithRoles,
        startDate: formData.startDate,
        endDate: formData.endDate,
      });
      return { isValid: true };
    } catch (error) {
      if (error instanceof Error) {
        return { isValid: false, errorMessage: error.message };
      }
      return { isValid: false, errorMessage: 'Erreur de validation du formulaire' };
    }
  }

  static validateTeamRoles(selectedUsersWithRoles: any[]): ValidationResult {
    if (selectedUsersWithRoles.length === 0) {
      return { isValid: false, errorMessage: 'Au moins un employé doit être assigné à la mission' };
    }

    // Check for required roles
    const hasChefDeGroupe = selectedUsersWithRoles.some(u => u.roles.includes('Chef de Groupe'));
    const hasChauffeur = selectedUsersWithRoles.some(u => u.roles.includes('Chauffeur'));

    if (!hasChefDeGroupe) {
      return { isValid: false, errorMessage: 'Au moins un Chef de Groupe est requis pour la mission' };
    }

    if (!hasChauffeur) {
      return { isValid: false, errorMessage: 'Au moins un Chauffeur est requis pour la mission' };
    }

    return { isValid: true };
  }
}
