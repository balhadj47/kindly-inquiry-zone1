
import { User, UserStatus } from '@/types/rbac';

export interface FormData {
  name: string;
  phone: string;
  status: UserStatus;
  badgeNumber: string;
  dateOfBirth: string;
  placeOfBirth: string;
  address: string;
  driverLicense?: string;
  profileImage?: string;
  email?: string;
  // New fields from other tabs
  identificationNational?: string;
  carteNational?: string;
  carteNationalStartDate?: string;
  carteNationalExpiryDate?: string;
  driverLicenseStartDate?: string;
  driverLicenseExpiryDate?: string;
  driverLicenseCategory?: string[];
  driverLicenseCategoryDates?: Record<string, { start?: string; expiry?: string }>;
  bloodType?: string;
  companyAssignmentDate?: string;
}

// Helper function to safely extract string values
export const extractStringValue = (value: any): string | undefined => {
  if (value === null || value === undefined) return undefined;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null && 'value' in value) {
    return typeof value.value === 'string' ? value.value : undefined;
  }
  return undefined;
};

export const getDefaultFormValues = (employee?: User | null): FormData => {
  return {
    name: employee?.name || '',
    phone: employee?.phone || '',
    status: employee?.status || 'Active',
    badgeNumber: extractStringValue(employee?.badgeNumber) || '',
    dateOfBirth: extractStringValue(employee?.dateOfBirth) || '',
    placeOfBirth: extractStringValue(employee?.placeOfBirth) || '',
    address: extractStringValue(employee?.address) || '',
    driverLicense: extractStringValue(employee?.driverLicense) || '',
    profileImage: extractStringValue(employee?.profileImage) || '',
    email: extractStringValue(employee?.email) || '',
    // New fields with proper mapping
    identificationNational: extractStringValue((employee as any)?.identification_national) || '',
    carteNational: extractStringValue((employee as any)?.carte_national) || '',
    carteNationalStartDate: extractStringValue((employee as any)?.carte_national_start_date) || '',
    carteNationalExpiryDate: extractStringValue((employee as any)?.carte_national_expiry_date) || '',
    driverLicenseStartDate: extractStringValue((employee as any)?.driver_license_start_date) || '',
    driverLicenseExpiryDate: extractStringValue((employee as any)?.driver_license_expiry_date) || '',
    driverLicenseCategory: (employee as any)?.driver_license_category || [],
    driverLicenseCategoryDates: (employee as any)?.driver_license_category_dates || {},
    bloodType: extractStringValue((employee as any)?.blood_type) || '',
    companyAssignmentDate: extractStringValue((employee as any)?.company_assignment_date) || '',
  };
};

export const prepareSubmitData = (data: FormData) => {
  return {
    name: data.name?.trim() || '',
    email: data.email?.trim() || undefined,
    phone: data.phone?.trim() || undefined,
    status: data.status,
    // Handle profileImage explicitly - preserve empty string for removal
    profileImage: typeof data.profileImage === 'string' ? data.profileImage : undefined,
    badgeNumber: data.badgeNumber?.trim() || undefined,
    dateOfBirth: data.dateOfBirth?.trim() || undefined,
    placeOfBirth: data.placeOfBirth?.trim() || undefined,
    address: data.address?.trim() || undefined,
    driverLicense: data.driverLicense?.trim() || undefined,
    role_id: 3, // Employee role
    // Map form data to proper field names for database
    identification_national: data.identificationNational?.trim() || undefined,
    carte_national: data.carteNational?.trim() || undefined,
    carte_national_start_date: data.carteNationalStartDate?.trim() || undefined,
    carte_national_expiry_date: data.carteNationalExpiryDate?.trim() || undefined,
    driver_license_start_date: data.driverLicenseStartDate?.trim() || undefined,
    driver_license_expiry_date: data.driverLicenseExpiryDate?.trim() || undefined,
    driver_license_category: data.driverLicenseCategory || [],
    driver_license_category_dates: data.driverLicenseCategoryDates || {},
    blood_type: data.bloodType?.trim() || undefined,
    company_assignment_date: data.companyAssignmentDate?.trim() || undefined,
  };
};
