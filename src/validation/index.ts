
// Central validation exports
export { TripValidators } from './validators/tripValidators';
export { UserValidators } from './validators/userValidators';

export type { ValidationResult } from './validators/tripValidators';
export type { UserValidationResult } from './validators/userValidators';

// Schema exports
export {
  nameSchema,
  emailSchema,
  requiredEmailSchema,
  phoneSchema,
  badgeNumberSchema,
  userStatusSchema,
  dateSchema,
  userValidationSchema,
  employeeValidationSchema,
  userCreationSchema,
} from './schemas/userValidation';

export {
  kilometerSchema,
  baseDateRangeSchema,
  dateRangeSchema,
  tripBasicSchema,
  tripCompanySchema,
  tripTeamSchema,
  tripDetailsSchema,
  fullTripSchema,
} from './schemas/tripValidation';
