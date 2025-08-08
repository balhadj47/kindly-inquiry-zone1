
import { User } from '@/types/rbac';
import { 
  userValidationSchema, 
  employeeValidationSchema, 
  userCreationSchema 
} from '../schemas/userValidation';

export interface UserValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export class UserValidators {
  static validateUser(userData: Partial<User>, isEmployee: boolean = false): UserValidationResult {
    try {
      const schema = isEmployee ? employeeValidationSchema : userValidationSchema;
      schema.parse(userData);
      return { isValid: true };
    } catch (error) {
      if (error instanceof Error) {
        return { isValid: false, errorMessage: error.message };
      }
      return { isValid: false, errorMessage: 'Erreur de validation utilisateur' };
    }
  }

  static validateUserCreation(userData: Partial<User>): UserValidationResult {
    try {
      userCreationSchema.parse(userData);
      return { isValid: true };
    } catch (error) {
      if (error instanceof Error) {
        return { isValid: false, errorMessage: error.message };
      }
      return { isValid: false, errorMessage: 'Erreur de validation création utilisateur' };
    }
  }

  static validateEmailUniqueness(email: string, users: User[], excludeUserId?: string): UserValidationResult {
    if (!email || email.trim() === '') {
      return { isValid: true }; // Empty email is handled by schema validation
    }

    const isDuplicate = users.some(user => {
      if (excludeUserId && user.id === excludeUserId) {
        return false;
      }
      return user.email && user.email.toLowerCase() === email.toLowerCase().trim();
    });

    if (isDuplicate) {
      return { isValid: false, errorMessage: 'Cet email est déjà utilisé' };
    }

    return { isValid: true };
  }

  static canUserAccessTrips(user: User | null): boolean {
    if (!user) return false;
    return user.status === 'Active';
  }

  static isUserAvailableForTrip(user: User): boolean {
    if (!user) return false;
    const unavailableStatuses = ['Suspended', 'Congé', 'Congé maladie'];
    return !unavailableStatuses.includes(user.status);
  }
}
