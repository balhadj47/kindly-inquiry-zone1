
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

// Helper function to convert date strings to proper format or undefined
export const formatDateForDatabase = (dateString: string | undefined | null): string | undefined => {
  if (!dateString || dateString.trim() === '') return undefined;
  
  try {
    // If it's already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // Try to parse and format the date
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return undefined;
    
    return date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
  } catch (error) {
    console.warn('Date formatting error:', error, dateString);
    return undefined;
  }
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
  // Clean and prepare the data, ensuring null values are properly handled
  const cleanData = {
    name: data.name?.trim() || '',
    email: data.email?.trim() || undefined,
    phone: data.phone?.trim() || undefined,
    status: data.status,
    // Handle profileImage explicitly - preserve empty string for removal
    profileImage: typeof data.profileImage === 'string' ? data.profileImage : undefined,
    badgeNumber: data.badgeNumber?.trim() || undefined,
    dateOfBirth: formatDateForDatabase(data.dateOfBirth),
    placeOfBirth: data.placeOfBirth?.trim() || undefined,
    address: data.address?.trim() || undefined,
    driverLicense: data.driverLicense?.trim() || undefined,
    role_id: 3, // Employee role
    // Map form data to proper field names for database with proper date formatting
    identification_national: data.identificationNational?.trim() || undefined,
    carte_national: data.carteNational?.trim() || undefined,
    carte_national_start_date: formatDateForDatabase(data.carteNationalStartDate),
    carte_national_expiry_date: formatDateForDatabase(data.carteNationalExpiryDate),
    driver_license_start_date: formatDateForDatabase(data.driverLicenseStartDate),
    driver_license_expiry_date: formatDateForDatabase(data.driverLicenseExpiryDate),
    driver_license_category: data.driverLicenseCategory && data.driverLicenseCategory.length > 0 ? data.driverLicenseCategory : undefined,
    driver_license_category_dates: data.driverLicenseCategoryDates && Object.keys(data.driverLicenseCategoryDates).length > 0 ? data.driverLicenseCategoryDates : undefined,
    blood_type: data.bloodType?.trim() || undefined,
    company_assignment_date: formatDateForDatabase(data.companyAssignmentDate),
  };

  // Remove any fields that are undefined to avoid sending null values
  const finalData = Object.fromEntries(
    Object.entries(cleanData).filter(([_, value]) => value !== undefined)
  );

  console.log('🔧 FormDataHelpers - Cleaned data for submission:', finalData);
  
  return finalData;
};
