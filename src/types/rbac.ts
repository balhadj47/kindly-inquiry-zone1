
import { SystemGroupName, SystemGroup, Permission } from './systemGroups';
import { MissionRole } from './missionRoles';

export type UserStatus = 'Active' | 'Inactive' | 'Suspended' | 'Récupération' | 'Congé' | 'Congé maladie';

export interface User {
  id: string;
  name: string;
  email?: string; // Made optional for employees
  phone: string;
  systemGroup: SystemGroupName;
  missionRole?: MissionRole;
  status: UserStatus;
  createdAt: string;
  licenseNumber?: string;
  totalTrips?: number;
  lastTrip?: string;
  profileImage?: string;
  // New fields for employees
  badgeNumber?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  address?: string;
  driverLicense?: string;
  // Backward compatibility - add a getter for role
  get role(): SystemGroupName;
}

// Re-export system group types for backward compatibility
export type { SystemGroup, SystemGroupName, Permission } from './systemGroups';
export type { MissionRole } from './missionRoles';

// For backward compatibility, keep these empty
export const AVAILABLE_PERMISSIONS: Permission[] = [];
export const DEFAULT_PERMISSIONS = AVAILABLE_PERMISSIONS;
export const DEFAULT_ROLES: SystemGroup[] = [];
