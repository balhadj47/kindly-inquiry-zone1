
import { User } from '@/types/rbac';

export interface UserValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export class UserBusinessLogic {
  static validateUserData(userData: Partial<User>): UserValidationResult {
    if (!userData.name || userData.name.trim().length < 2) {
      return {
        isValid: false,
        errorMessage: 'Le nom doit contenir au moins 2 caractères'
      };
    }

    if (userData.email && !this.isValidEmail(userData.email)) {
      return {
        isValid: false,
        errorMessage: 'Format d\'email invalide'
      };
    }

    if (userData.phone && !this.isValidPhone(userData.phone)) {
      return {
        isValid: false,
        errorMessage: 'Format de téléphone invalide'
      };
    }

    return { isValid: true };
  }

  static canUserAccessTrips(user: User | null): boolean {
    if (!user) return false;
    
    // Business rule: Active users with appropriate roles can access trips
    if (user.status !== 'Active') return false;
    
    return true;
  }

  static canUserCreateTrips(user: User | null): boolean {
    if (!user) return false;
    
    // Business rule: Only active users can create trips
    if (user.status !== 'Active') return false;
    
    return true;
  }

  static getUserDisplayName(user: User): string {
    if (!user) return 'Utilisateur inconnu';
    
    return user.name || `Utilisateur ${user.id}`;
  }

  static isUserAvailableForTrip(user: User): boolean {
    if (!user) return false;
    
    // Business rules for user availability
    const unavailableStatuses = ['Suspended', 'Congé', 'Congé maladie'];
    return !unavailableStatuses.includes(user.status);
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{8,}$/;
    return phoneRegex.test(phone);
  }
}
