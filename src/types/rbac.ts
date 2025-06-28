
import { SystemGroupName, SystemGroup, Permission } from './systemGroups';
import { MissionRole } from './missionRoles';

export type UserStatus = 'Active' | 'Inactive' | 'Suspended' | 'Récupération' | 'Congé' | 'Congé maladie';

export interface User {
  id: string;
  name: string;
  email?: string; // Made optional for employees
  phone: string;
  role_id: number; // Use role_id instead of systemGroup
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
}

// Re-export system group types for backward compatibility
export type { SystemGroup, SystemGroupName, Permission } from './systemGroups';
export type { MissionRole } from './missionRoles';

// All permissions and roles now come from database only
export const AVAILABLE_PERMISSIONS: Permission[] = [];
export const DEFAULT_PERMISSIONS = AVAILABLE_PERMISSIONS;
export const DEFAULT_ROLES: SystemGroup[] = [];
