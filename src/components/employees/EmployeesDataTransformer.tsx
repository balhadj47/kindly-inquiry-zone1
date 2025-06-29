
import { User } from '@/types/rbac';

// Enhanced user data transformer with comprehensive error handling
export const transformOptimizedUser = (user: any): User | null => {
  try {
    if (!user) {
      console.warn('⚠️ Employees: Null user data for transformation');
      return null;
    }

    if (typeof user !== 'object') {
      console.warn('⚠️ Employees: Invalid user data type for transformation:', typeof user);
      return null;
    }

    // Validate required fields
    if (!user.id) {
      console.warn('⚠️ Employees: User missing required ID field:', user);
      return null;
    }

    return {
      id: user.id,
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || null,
      role_id: user.role_id || 3,
      status: user.status || 'active',
      createdAt: user.created_at || new Date().toISOString(),
      totalTrips: user.total_trips || 0,
      lastTrip: user.last_trip || null,
      profileImage: user.profile_image || null,
      badgeNumber: user.badge_number || null,
      dateOfBirth: user.date_of_birth || null,
      placeOfBirth: user.place_of_birth || null,
      address: user.address || null,
      driverLicense: user.driver_license || null,
    };
  } catch (error) {
    console.error('❌ Employees: Error transforming user data:', error, user);
    return null;
  }
};

export const useProcessedEmployees = (rawEmployees: any): User[] => {
  return React.useMemo(() => {
    try {
      console.log('👥 Employees: Processing raw employees data:', {
        rawEmployeesType: typeof rawEmployees,
        isArray: Array.isArray(rawEmployees),
        length: Array.isArray(rawEmployees) ? rawEmployees.length : 'N/A',
        sample: Array.isArray(rawEmployees) ? rawEmployees[0] : rawEmployees
      });

      if (!rawEmployees) {
        console.warn('⚠️ Employees: Raw employees data is null/undefined');
        return [];
      }

      if (!Array.isArray(rawEmployees)) {
        console.warn('⚠️ Employees: Raw employees data is not an array:', typeof rawEmployees, rawEmployees);
        return [];
      }

      const processed = rawEmployees
        .map((user, index) => {
          try {
            return transformOptimizedUser(user);
          } catch (transformError) {
            console.error(`❌ Employees: Error transforming user at index ${index}:`, transformError, user);
            return null;
          }
        })
        .filter((employee): employee is User => {
          if (employee === null) {
            return false;
          }
          return true;
        });

      console.log('✅ Employees: Successfully processed employees:', {
        originalCount: rawEmployees.length,
        processedCount: processed.length,
        filtered: processed.length !== rawEmployees.length
      });

      return processed;
    } catch (error) {
      console.error('❌ Employees: Critical error processing employees data:', error);
      return [];
    }
  }, [rawEmployees]);
};
