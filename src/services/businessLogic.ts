
// Consolidated business logic exports
export { TripBusinessLogic } from './tripBusinessLogic';
export { UserBusinessLogic } from './userBusinessLogic';
export { VanBusinessLogic } from './vanBusinessLogic';
export { PermissionsBusinessLogic } from './permissionsBusinessLogic';

// Common validation types
export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export interface BusinessRuleResult {
  allowed: boolean;
  reason?: string;
}
