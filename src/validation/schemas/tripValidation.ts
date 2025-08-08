
import { z } from 'zod';

export const kilometerSchema = z.string()
  .regex(/^\d+$/, 'Le kilométrage doit être un nombre')
  .refine((val) => parseInt(val) >= 0, 'Le kilométrage ne peut pas être négatif');

export const dateRangeSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
}).refine((data) => {
  if (!data.startDate || !data.endDate) return true;
  return data.startDate <= data.endDate;
}, {
  message: 'La date de fin doit être après la date de début',
  path: ['endDate'],
});

export const tripBasicSchema = z.object({
  vanId: z.string().min(1, 'Veuillez sélectionner une camionnette'),
  startKm: kilometerSchema,
  notes: z.string().max(1000, 'Les notes ne peuvent pas dépasser 1000 caractères').optional(),
});

export const tripCompanySchema = z.object({
  selectedCompanies: z.array(z.object({
    companyId: z.string().min(1, 'ID de l\'entreprise requis'),
    companyName: z.string().min(1, 'Nom de l\'entreprise requis'),
    branchId: z.string().min(1, 'Veuillez sélectionner une succursale'),
  })).min(1, 'Au moins une entreprise doit être sélectionnée'),
});

export const tripTeamSchema = z.object({
  selectedUsersWithRoles: z.array(z.object({
    userId: z.string().min(1, 'ID utilisateur requis'),
    roles: z.array(z.string()).min(1, 'Au moins un rôle doit être assigné'),
  })).min(1, 'Au moins un membre d\'équipe doit être sélectionné'),
});

export const tripDetailsSchema = dateRangeSchema;

export const fullTripSchema = tripBasicSchema
  .merge(tripCompanySchema)
  .merge(tripTeamSchema)
  .merge(tripDetailsSchema);
