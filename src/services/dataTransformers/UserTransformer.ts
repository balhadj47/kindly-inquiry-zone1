
import { BaseTransformer } from './types';
import { User } from '@/types/rbac';

export interface DatabaseUser {
  id: any;
  name?: string;
  email?: string;
  phone?: string;
  role_id?: number;
  status?: string;
  created_at?: string;
  total_trips?: number;
  last_trip?: string;
  profile_image?: string;
  badge_number?: string;
  date_of_birth?: string;
  place_of_birth?: string;
  address?: string;
  driver_license?: string;
}

export class UserTransformer extends BaseTransformer<DatabaseUser, User> {
  transform(dbUser: DatabaseUser): User {
    if (!dbUser) {
      throw new Error('User data is required');
    }

    const idValidation = this.validateRequired(dbUser.id, 'User ID');
    if (!idValidation.isValid) {
      throw new Error(idValidation.errors?.[0] || 'Invalid user ID');
    }

    return {
      id: dbUser.id.toString(),
      name: dbUser.name || '',
      email: dbUser.email || '',
      phone: dbUser.phone || '',
      role_id: dbUser.role_id || 3,
      status: (dbUser.status as User['status']) || 'Active',
      createdAt: dbUser.created_at || new Date().toISOString(),
      totalTrips: dbUser.total_trips || 0,
      lastTrip: dbUser.last_trip || null,
      profileImage: dbUser.profile_image || null,
      badgeNumber: dbUser.badge_number || null,
      dateOfBirth: dbUser.date_of_birth || null,
      placeOfBirth: dbUser.place_of_birth || null,
      address: dbUser.address || null,
      driverLicense: dbUser.driver_license || null,
    };
  }

  // Enhanced transformation with error handling
  safeTransformUser(dbUser: DatabaseUser): User | null {
    const result = this.safeTransform(
      dbUser,
      () => this.transform(dbUser),
      null as any
    );

    if (!result.validation.isValid) {
      console.warn('⚠️ User transformation failed:', result.validation.errors, dbUser);
      return null;
    }

    return result.data;
  }

  // Legacy compatibility methods
  transformOptimizedUser = this.safeTransformUser.bind(this);
}

// Export singleton instance
export const userTransformer = new UserTransformer();
