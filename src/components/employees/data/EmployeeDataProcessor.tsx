
import { useMemo } from 'react';
import { User } from '@/types/rbac';
import { userTransformer } from '@/services/dataTransformers';

interface ProcessedEmployeeData {
  employees: User[];
  isProcessing: boolean;
  processingStats: {
    originalCount: number;
    processedCount: number;
    hasErrors: boolean;
  };
}

export const useEmployeeDataProcessor = (rawEmployees: any[]): ProcessedEmployeeData => {
  const { employees, isProcessing, processingStats } = useMemo(() => {
    if (!rawEmployees || !Array.isArray(rawEmployees)) {
      return {
        employees: [],
        isProcessing: false,
        processingStats: { originalCount: 0, processedCount: 0, hasErrors: false }
      };
    }

    console.log('👥 Processing employees data:', {
      count: rawEmployees.length,
      sample: rawEmployees[0]
    });

    const processed: User[] = [];
    
    for (const emp of rawEmployees) {
      try {
        // Parse driver_license_category_dates once and cache it
        let parsedCategoryDates = {};
        if (emp.driver_license_category_dates) {
          if (typeof emp.driver_license_category_dates === 'object' && 
              emp.driver_license_category_dates !== null &&
              !Array.isArray(emp.driver_license_category_dates)) {
            parsedCategoryDates = emp.driver_license_category_dates;
          } else if (typeof emp.driver_license_category_dates === 'string') {
            try {
              const parsed = JSON.parse(emp.driver_license_category_dates);
              if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
                parsedCategoryDates = parsed;
              }
            } catch {
              console.warn('Failed to parse driver_license_category_dates for employee:', emp.id);
            }
          }
        }

        const transformedEmployee: User = {
          id: emp.id?.toString() || '',
          name: emp.name || '',
          email: emp.email || '',
          phone: emp.phone || '',
          role_id: emp.role_id || 3,
          status: emp.status as User['status'],
          createdAt: emp.created_at || new Date().toISOString(),
          badgeNumber: emp.badge_number,
          dateOfBirth: emp.date_of_birth,
          placeOfBirth: emp.place_of_birth,
          address: emp.address,
          driverLicense: emp.driver_license,
          totalTrips: emp.total_trips,
          lastTrip: emp.last_trip,
          profileImage: emp.profile_image,
          identification_national: emp.identification_national,
          carte_national: emp.carte_national,
          carte_national_start_date: emp.carte_national_start_date,
          carte_national_expiry_date: emp.carte_national_expiry_date,
          driver_license_start_date: emp.driver_license_start_date,
          driver_license_expiry_date: emp.driver_license_expiry_date,
          driver_license_category: emp.driver_license_category,
          driver_license_category_dates: parsedCategoryDates,
          blood_type: emp.blood_type,
          company_assignment_date: emp.company_assignment_date,
        };

        processed.push(transformedEmployee);
      } catch (error) {
        console.error('Failed to process employee:', emp.id, error);
      }
    }

    console.log('✅ Processed employees:', {
      originalCount: rawEmployees.length,
      processedCount: processed.length
    });

    return {
      employees: processed,
      isProcessing: false,
      processingStats: {
        originalCount: rawEmployees.length,
        processedCount: processed.length,
        hasErrors: processed.length !== rawEmployees.length
      }
    };
  }, [rawEmployees]);

  return { employees, isProcessing, processingStats };
};
