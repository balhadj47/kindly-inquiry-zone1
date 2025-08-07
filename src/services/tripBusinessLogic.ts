
import { Trip } from '@/contexts/TripContext';
import { User } from '@/types/rbac';

export interface TripValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export interface KilometerValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export class TripBusinessLogic {
  static validateTripTermination(
    trip: Trip,
    finalKm: string,
    currentUser: User | null
  ): TripValidationResult {
    if (!trip) {
      return {
        isValid: false,
        errorMessage: 'Mission non trouvée'
      };
    }

    if (!currentUser) {
      return {
        isValid: false,
        errorMessage: 'Utilisateur non authentifié'
      };
    }

    if (trip.status !== 'active') {
      return {
        isValid: false,
        errorMessage: 'Seules les missions actives peuvent être terminées'
      };
    }

    if (!finalKm || finalKm.trim() === '') {
      return {
        isValid: false,
        errorMessage: 'Veuillez saisir le kilométrage final'
      };
    }

    const kmNumber = parseInt(finalKm, 10);
    if (isNaN(kmNumber) || kmNumber < 0) {
      return {
        isValid: false,
        errorMessage: 'Veuillez saisir un kilométrage valide'
      };
    }

    const startKm = trip.start_km || trip.startKm;
    if (startKm && kmNumber < startKm) {
      return {
        isValid: false,
        errorMessage: 'Le kilométrage final ne peut pas être inférieur au kilométrage initial'
      };
    }

    // Business rule: Check for reasonable distance
    if (startKm) {
      const distance = kmNumber - startKm;
      if (distance > 5000) {
        return {
          isValid: false,
          errorMessage: 'Distance trop importante (>5000km), veuillez vérifier'
        };
      }
    }

    return { isValid: true };
  }

  static canTerminateTrip(trip: Trip, currentUser: User | null): boolean {
    if (!trip || !currentUser) return false;
    
    // Check if trip is in active status
    if (trip.status !== 'active') return false;
    
    // Check if user has permission to terminate trips
    // This would integrate with your RBAC system
    return true;
  }

  static canEditTrip(trip: Trip, currentUser: User | null): boolean {
    if (!trip || !currentUser) return false;
    
    // Business rule: Only active trips can be edited
    if (trip.status === 'completed') return false;
    
    return true;
  }

  static canDeleteTrip(trip: Trip, currentUser: User | null): boolean {
    if (!trip || !currentUser) return false;
    
    // Business rule: Completed trips cannot be deleted (audit trail)
    if (trip.status === 'completed') return false;
    
    return true;
  }

  static calculateTripDuration(trip: Trip): number | null {
    if (!trip.startDate || !trip.endDate) return null;
    
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    
    return Math.abs(end.getTime() - start.getTime());
  }

  static validateKilometers(startKm: number, endKm: number): KilometerValidationResult {
    if (startKm < 0 || endKm < 0) {
      return {
        isValid: false,
        errorMessage: 'Les kilométrages ne peuvent pas être négatifs'
      };
    }

    if (endKm < startKm) {
      return {
        isValid: false,
        errorMessage: 'Le kilométrage final doit être supérieur au kilométrage initial'
      };
    }

    const distance = endKm - startKm;
    if (distance > 10000) { // Business rule: trips over 10,000km need approval
      return {
        isValid: false,
        errorMessage: 'Distance trop importante, veuillez contacter un administrateur'
      };
    }

    return { isValid: true };
  }
}
