
import { Van } from '@/types/van';

export interface VanValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export class VanBusinessLogic {
  static validateVanData(vanData: Partial<Van>): VanValidationResult {
    if (!vanData.model || vanData.model.trim().length < 2) {
      return {
        isValid: false,
        errorMessage: 'Le modèle doit contenir au moins 2 caractères'
      };
    }

    if (!vanData.reference_code || vanData.reference_code.trim().length < 1) {
      return {
        isValid: false,
        errorMessage: 'Le code de référence est obligatoire'
      };
    }

    if (vanData.license_plate && !this.isValidLicensePlate(vanData.license_plate)) {
      return {
        isValid: false,
        errorMessage: 'Format de plaque d\'immatriculation invalide'
      };
    }

    return { isValid: true };
  }

  static isVanAvailable(van: Van): boolean {
    if (!van) return false;
    
    // Business rule: Only active vans are available for trips
    return van.status === 'Active';
  }

  static needsMaintenance(van: Van): boolean {
    if (!van) return false;
    
    // Business rule: Check if van needs maintenance based on status
    return van.status === 'Maintenance';
  }

  static getVanDisplayName(van: Van): string {
    if (!van) return 'Véhicule inconnu';
    
    if (van.license_plate) {
      return `${van.license_plate} (${van.model})`;
    }
    
    return van.model || van.reference_code || 'Véhicule sans nom';
  }

  static canVanBeDeleted(van: Van): boolean {
    if (!van) return false;
    
    // Business rule: Active vans with ongoing trips cannot be deleted
    // This would need to check for active trips in a real implementation
    return van.status !== 'Active';
  }

  private static isValidLicensePlate(licensePlate: string): boolean {
    // French license plate format (simplified)
    const plateRegex = /^[A-Z]{2}-[\d]{3}-[A-Z]{2}$|^[\d]{1,4}\s?[A-Z]{1,3}\s?[\d]{1,3}$/;
    return plateRegex.test(licensePlate.replace(/\s/g, ''));
  }
}
