
import { z } from 'zod';
import { UserStatus } from '@/types/rbac';

// Common field schemas
export const nameSchema = z.string()
  .min(2, 'Le nom doit contenir au moins 2 caractères')
  .max(100, 'Le nom ne peut pas dépasser 100 caractères')
  .trim();

export const emailSchema = z.string()
  .email('Format d\'email invalide')
  .optional()
  .or(z.literal(''));

export const requiredEmailSchema = z.string()
  .email('Format d\'email invalide')
  .min(1, 'L\'email est requis');

export const phoneSchema = z.string()
  .regex(/^\+?[\d\s\-\(\)]{8,}$/, 'Format de téléphone invalide')
  .optional()
  .or(z.literal(''));

export const badgeNumberSchema = z.string()
  .min(1, 'Le numéro de badge est requis')
  .max(50, 'Le numéro de badge ne peut pas dépasser 50 caractères');

export const userStatusSchema = z.enum(['Active', 'Inactive', 'Suspended', 'Récupération', 'Congé', 'Congé maladie'] as const);

export const dateSchema = z.string()
  .optional()
  .refine((date) => {
    if (!date || date === '') return true;
    return !isNaN(Date.parse(date));
  }, 'Format de date invalide');

// Main user validation schema
export const userValidationSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  role_id: z.number().min(1, 'Un rôle est requis'),
  status: userStatusSchema,
  badgeNumber: z.string().optional(),
  dateOfBirth: dateSchema,
  placeOfBirth: z.string().max(200, 'Le lieu de naissance ne peut pas dépasser 200 caractères').optional(),
  address: z.string().max(500, 'L\'adresse ne peut pas dépasser 500 caractères').optional(),
  driverLicense: z.string().max(50, 'Le permis de conduire ne peut pas dépasser 50 caractères').optional(),
});

// Employee-specific validation (requires additional fields)
export const employeeValidationSchema = userValidationSchema.extend({
  badgeNumber: badgeNumberSchema,
  dateOfBirth: z.string().min(1, 'La date de naissance est requise'),
  placeOfBirth: z.string().min(1, 'Le lieu de naissance est requis'),
  address: z.string().min(1, 'L\'adresse est requise'),
});

// User creation schema (requires email)
export const userCreationSchema = userValidationSchema.extend({
  email: requiredEmailSchema,
});
