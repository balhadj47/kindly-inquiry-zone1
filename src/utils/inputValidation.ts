
import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Invalid email format').min(1, 'Email is required');
export const phoneSchema = z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format').optional();
export const nameSchema = z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long');
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters').regex(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  'Password must contain uppercase, lowercase, number and special character'
);

// Van validation schemas
export const vanSchema = z.object({
  model: z.string().min(1, 'Model is required').max(100, 'Model too long'),
  reference_code: z.string().min(1, 'Reference code is required').max(50, 'Reference code too long'),
  license_plate: z.string().max(20, 'License plate too long').optional(),
  status: z.enum(['Active', 'Inactive', 'Maintenance']),
  notes: z.string().max(500, 'Notes too long').optional(),
  insurer: z.string().max(100, 'Insurer name too long').optional(),
});

// User validation schemas
export const userSchema = z.object({
  name: nameSchema,
  email: emailSchema.optional(),
  phone: phoneSchema,
  role_id: z.number().min(1, 'Role is required'),
  status: z.enum(['Active', 'Inactive', 'Suspended', 'Récupération', 'Congé', 'Congé maladie']),
  badge_number: z.string().max(50, 'Badge number too long').optional(),
  driver_license: z.string().max(50, 'Driver license too long').optional(),
});

// Trip validation schemas
export const tripSchema = z.object({
  vanId: z.string().min(1, 'Van is required'),
  companyId: z.string().min(1, 'Company is required'),
  branchId: z.string().min(1, 'Branch is required'),
  startKm: z.string().regex(/^\d+$/, 'Start km must be a number'),
  notes: z.string().max(1000, 'Notes too long').optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// Company validation schemas
export const companySchema = z.object({
  name: z.string().min(1, 'Company name is required').max(100, 'Company name too long'),
  email: emailSchema.optional(),
  phone: phoneSchema,
  address: z.string().max(200, 'Address too long').optional(),
});

// Role validation schemas
export const roleSchema = z.object({
  name: z.string().min(1, 'Role name is required').max(50, 'Role name too long'),
  description: z.string().min(1, 'Description is required').max(200, 'Description too long'),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
  permissions: z.array(z.string()).min(1, 'At least one permission is required'),
});

// Sanitization functions
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const sanitizeHtml = (input: string): string => {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
              .replace(/<[^>]*>/g, '')
              .trim();
};

// Validation helper functions
export const validateAndSanitize = <T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; errors?: string[] } => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`) 
      };
    }
    return { success: false, errors: ['Validation failed'] };
  }
};
